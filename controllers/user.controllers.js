import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


// signup
export const register = async(req,res) => {
    try{
    const { fullName,email,phoneNumber,password,role,confirmPassword} = req.body;
    

    if(!fullName || !email || !phoneNumber || !password || !confirmPassword || !role ){
       return res.status(400).json({
        message:"Your Values are missing",
        success: false
       })
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if(user) {
        return res.status(400).json({
            message:"user already exist with this email",
            success: false
        })
    }
    const hashedPassword = await bcrypt.hash(password,10);

    await User.create({
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        confirmPassword:hashedPassword,
        role,
        profile:{
             profilePhoto:cloudResponse.secure_url
        }
    })
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

     return res.status(201).json({
        message:"Account created Successfully",
        success: true
     }) 

    } catch(error){
        console.log(error);
    }
    
}

// login
export const login = async(req,res) => {
    try {
        const{email,password,role} = req.body;
       console.log(email,password,role)
        if(!email || !password || !role){
            return res.status(400).json({
                message:"Input Fields are missing",
                success: false
            })
        }

        let user = await User.findOne({email});
        if(!user){
         return res.status(400).json({
            message:"Entered Email or Password is not correct",
            success: false
         })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"Entered Password is not correct",
                success: false
            })
        }

        if(role != user.role){
            return res.status(400).json({
                message:"Account with this role doesn't exist",
                success: false
            })
        };

       const tokenData = {
            userId: user._id
       }

       const token = await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn:'1d'});

       user = {
         _id: user._id,
         fullName: user.fullName,
         email: user.email,
         phoneNumber: user.phoneNumber,
         role: user.role,
         profile: user.profile
       }

       return res.status(200).cookie("token", token, {maxAge: 1*24*60*60*1000, httpsOnly: true, sameSite:'strict'}).json({
        message: `Welcome Back ${user.fullName}`,
        user,
        success: true
       })

    } catch (error) {
        console.log(error);
    }
}

// Logout
export const logOut = async(req,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
          message: "Logged out Successfully",
          success: true
        })
    } catch (error) {
        console.log(error)
    }
}

// updateProfile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, bio, skills } = req.body;
           console.log(fullName, email, phoneNumber, password, bio, skills )

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (!user.profile) {
            user.profile = {};
        }
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

         
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url  // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname; // save the original file name
        }



        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile Updated Successfully",
            user,
            success: true
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false
        });
    }
}

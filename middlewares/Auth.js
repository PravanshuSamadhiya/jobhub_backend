import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { User } from "../models/user.model.js";
dotenv.config();

const isAuthenticate = async (req, res, next) => {
    try {
        console.log("auth started")
        const token = req.cookies.token||req.body.token||req.header("Authorization").replace("Bearer ","");
       
      
        if (!token) {
            return res.status(401).json({
                message: "User not Authenticated",
                success: false
            });
            
        }
        console.log(token);
        const decode = jwt.verify(token, process.env.SECRET_KEY);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            });
        }
    
        console.log("decode", decode)
        req.id = decode.userId;
        console.log("auth end")
        next();
        
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export default isAuthenticate;

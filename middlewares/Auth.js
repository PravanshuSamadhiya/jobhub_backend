import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const isAuthenticate = async (req, res, next) => {
    try {
        console.log("auth started")
        const token = req.cookies.token;
        

        if (!token) {
            return res.status(401).json({
                message: "User not Authenticated",
                success: false
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            });
        }

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

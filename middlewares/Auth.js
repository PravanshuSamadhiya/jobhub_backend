import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const isAuthenticate = (req, res, next) => {
    try {
        console.log("Auth started");
        
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                message: "User not Authenticated",
                success: false
            });
        }

        console.log("Token:", token);

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            });
        }

        console.log("Decoded token:", decode);
        req.userId = decode.userId;  // Assign userId to req.userId for clarity
        
        console.log("Auth successful");
        next();
    } catch (error) {
        console.error("Authentication Error:", error);

        // If the error is related to token verification, return a 401 status
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Invalid or Expired Token",
                success: false
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export default isAuthenticate;

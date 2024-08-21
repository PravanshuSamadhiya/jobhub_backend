import mongoose from "mongoose";

const connectDB = async () => {
    try{
         await mongoose.connect(process.env.MONGO_URL);
         console.log("server will be connected");
    } catch { 
       console.log("error")
    }
}

export default connectDB;  
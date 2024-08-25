import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
const serverless = require("serverless-http");
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobsRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: ['https://jobhub-omega.vercel.app', 'http://localhost:5173'],
    credentials: true
};
app.use(cors(corsOptions));

app.get('/netlify/functions/api');

const PORT = process.env.PORT ||  3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/jobs",jobsRoute);
app.use("/api/v1/application",applicationRoute);


app.listen(PORT, () => {
    connectDB();
    console.log(`server will be started at ${PORT}`);
})

module.exports = app;
module.exports.handler = serverless(app);
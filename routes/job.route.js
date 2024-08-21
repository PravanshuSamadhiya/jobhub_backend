import express from "express";
import isAuthenticate from "../middlewares/Auth.js";
import { getAdminJobs, getAllJob, getJobById, postJob } from "../controllers/job.controller.js";



const router = express.Router();

router.route("/post").post(isAuthenticate,postJob);
router.route("/get").get(isAuthenticate,getAllJob);
router.route("/get/:id").get(isAuthenticate,getJobById);
router.route("/getadminjobs").get(isAuthenticate, getAdminJobs);

export default router;
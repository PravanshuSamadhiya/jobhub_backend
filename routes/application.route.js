import express from "express";
import isAuthenticate from "../middlewares/Auth.js";
import { applyJob, getApplicants, getAppliedJob, updateStatus } from "../controllers/application.controller.js";



const router = express.Router();

router.route("/apply/:id").get(isAuthenticate,applyJob);
router.route("/get").get(isAuthenticate,getAppliedJob);
router.route("/:id/applicants").get(isAuthenticate,getApplicants);
router.route("/status/:id/update").post(isAuthenticate, updateStatus);

export default router;
import express from "express";
import { login, register, updateProfile,logOut } from "../controllers/user.controllers.js";
import isAuthenticate from "../middlewares/Auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logOut").get(logOut);
router.route("/profile/update").post(isAuthenticate,singleUpload, updateProfile);

export default router;
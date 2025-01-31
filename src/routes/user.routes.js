import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/register").post(upload.single("profile_pic"), userRegister)

export default router
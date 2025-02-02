import { Router } from "express";
import { userRegister, userLogin } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route("/register").post(upload.single("profile_pic"), userRegister)
router.route('/login').post(userLogin)

export default router
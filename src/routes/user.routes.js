import { Router } from "express";
import { userRegister, userLogin, userLogout } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { VerifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(upload.single("profile_pic"), userRegister)
router.route('/login').post(userLogin)
router.route('/logout').post(VerifyToken, userLogout)

export default router
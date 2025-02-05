import { Router } from "express";
import { userRegister, userLogin, userLogout, getUser, refreshAccessToken, updateUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { VerifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(upload.single("profile_pic"), userRegister)
router.route('/login').post(userLogin)
router.route('/logout').post(VerifyToken, userLogout)
router.route('/get-user').get(VerifyToken, getUser)
router.route('/new-accesstoken').get(refreshAccessToken)
router.route('/update-user').patch(VerifyToken, updateUserDetails)
export default router
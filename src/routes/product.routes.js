import { Router } from "express";
import { addProduct } from "../controllers/product.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router()

router.route('/add-product').post(upload.single("image"), VerifyToken, addProduct)

export default router
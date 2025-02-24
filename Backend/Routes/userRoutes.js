import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import { upload, uploadImage } from "../middleware/Multer.js";
import authentication from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/upload-image", upload, authentication, uploadImage);

export default router;

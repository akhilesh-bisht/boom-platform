import express from "express";
import { uploadVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.js"; // your multer config
import { protect } from "../middlewares/auth.middleware.js"; // auth middleware

const router = express.Router();

// POST /api/videos/upload
router.post("/upload", protect, upload.single("videoFile"), uploadVideo);

export default router;

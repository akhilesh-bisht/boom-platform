import express from "express";
import {
  getAllVideos,
  uploadVideo,
  getVideoById,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/videos/upload
router.post("/upload", verifyJWT, upload.single("videoFile"), uploadVideo);

// GET /api/videos - Get paginated videos feed (auth required)
router.get("/", verifyJWT, getAllVideos);

// GET /api/videos/:id - Get video details (auth required)
router.get("/:id", verifyJWT, getVideoById);

export default router;

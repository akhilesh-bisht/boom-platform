import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { Video } from "../models/video.model.js";
import { Purchase } from "../models/purchase.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// POST /api/videos — Upload video (short or long)
export const uploadVideo = async (req, res) => {
  const { title, description, type, videoURL, price } = req.body;
  const creatorId = req.user?._id;

  if (!creatorId) {
    throw new ApiError(401, "Unauthorized: User not authenticated");
  }

  if (!title || !type) {
    throw new ApiError(400, "Title and video type are required");
  }

  const normalizedType = type.toLowerCase();
  const videoData = {
    title,
    description,
    type: normalizedType,
    creator: creatorId,
  };

  if (normalizedType === "short") {
    if (!req.file) {
      throw new ApiError(400, "Short-form video file is required");
    }

    const cloudResult = await uploadOnCloudinary(req.file.path);
    console.log(cloudResult);

    if (!cloudResult?.secure_url) {
      throw new ApiError(500, "Cloudinary upload failed");
    }

    videoData.videoFilePath = cloudResult.secure_url;
  } else if (normalizedType === "long") {
    if (!videoURL) {
      throw new ApiError(400, "Video URL is required for long-form");
    }
    if (price < 0) {
      throw new ApiError(400, "Price must be zero or positive");
    }
    videoData.videoURL = videoURL;
    videoData.price = Number(price) || 0;
  } else {
    throw new ApiError(400, "Invalid video type");
  }

  const video = await Video.create(videoData);
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully"));
};

// GET /api/videos — Paginated feed
export const getAllVideos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const videos = await Video.find()
      .populate("creator", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments();

    res.status(200).json(
      new ApiResponse(200, {
        videos,
        total,
        page,
        pages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch videos");
  }
};

// GET /api/videos/:id — Video detail + access logic
export const getVideoById = async (req, res) => {
  const videoId = req.params.id;
  const userId = req.user?._id;

  try {
    const video = await Video.findById(videoId).populate("creator", "username");
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    let hasAccess = true;

    // Check purchase only for paid long-form
    if (video.type === "long" && video.price > 0) {
      const purchase = await Purchase.findOne({
        user: userId,
        video: video._id,
      });
      hasAccess = !!purchase;
    }

    return res.status(200).json(new ApiResponse(200, { video, hasAccess }));
  } catch (error) {
    throw new ApiError(500, "Error fetching video details");
  }
};

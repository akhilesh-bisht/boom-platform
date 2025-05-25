import mongoose from "mongoose";
const { Schema, model } = mongoose;

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["short", "long"],
      required: [true, "Video type is required"],
    },
    filePath: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Video = model("Video", videoSchema);

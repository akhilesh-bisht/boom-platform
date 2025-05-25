import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: [true, "Video reference is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model("Comment", commentSchema);

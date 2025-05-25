import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const videoSchema = new Schema({}, { timestamps: true });

export const Video = model("Video", videoSchema);

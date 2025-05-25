import mongoose from "mongoose";
const { Schema, model } = mongoose;

const purchaseSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for purchase"],
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: [true, "Video is required for purchase"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
  },
  {
    timestamps: true,
  }
);

export const Purchase = model("Purchase", purchaseSchema);

import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User model schema definition
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    walletBalance: {
      type: Number,
      default: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  console.log("registr pass", this.password);

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//   Compare password method
userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error while comparing passwords");
  }
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

// export

export const User = model("User", userSchema);

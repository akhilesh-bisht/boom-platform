import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating  access tokens"
    );
  }
};

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  // Validate required fields
  if ([email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      {
        email,
      },
      {
        username,
      },
    ],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
  // Create user

  const user = await User.create({
    username,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select("-password ");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong during registration");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //   Validate inputs
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // 3 - Check if email or username exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "Email or username not registered");
  }

  // 4 - Check password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password does not match");
  }

  // 5 - Generate access token
  const { accessToken } = await generateAccessTokens(user._id);

  // 6 - Remove sensitive data
  const loggedUser = await User.findById(user._id).select("-password");
  // 7 - Set cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  console.log("accentoken ", accessToken);

  // 8 - Send response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
        },
        "User login success"
      )
    );
};

export const logoutUser = (req, res) => {
  // Clear the accessToken cookie
  res
    .status(200)
    .cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    })
    .json(new ApiResponse(200, null, "User logged out successfully"));
};

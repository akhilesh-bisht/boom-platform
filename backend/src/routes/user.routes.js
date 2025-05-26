import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controller.js";

const router = Router();

//  user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for user logout
router.post("/logout", logoutUser);

export default router;

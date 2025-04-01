import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser
} from "../controllers/authcontrollers.js";
import {
  validateRegister,
  validateLogin
} from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

// Protected route (placeholder)
router.post("/logout", logoutUser);

export default router;
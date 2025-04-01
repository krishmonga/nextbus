import express from "express";
import {
  getBuses,
  getBusById,
  addBus,
  updateBus,
  deleteBus,
  checkSeatAvailability
} from "../controllers/buscontroller.js";  
import { protect, checkUserRole } from "../middleware/authMiddleware.js";
import { validateBus } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getBuses);
router.get("/:id", getBusById);

// Protected routes
router.get("/availability", protect, checkSeatAvailability);

// Admin-only routes
router.post("/", protect, checkUserRole('admin'), validateBus, addBus);
router.put("/:id", protect, checkUserRole('admin'), validateBus, updateBus);
router.delete("/:id", protect, checkUserRole('admin'), deleteBus);

export default router;
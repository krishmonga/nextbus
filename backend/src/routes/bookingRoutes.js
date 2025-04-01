import express from "express";
import { 
  bookBus, 
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  getAllBookings
} from "../controllers/bookingController.js";
import { protect, checkUserRole } from "../middleware/authMiddleware.js";
import { validateBooking } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Apply protect middleware to all booking routes
router.use(protect);

// User booking routes
router.post("/", validateBooking, bookBus);
router.get("/", getUserBookings);
router.get("/:id", getBookingDetails);
router.delete("/:id", cancelBooking);

// Admin-only routes
router.get("/admin/all", checkUserRole('admin'), getAllBookings);

export default router;
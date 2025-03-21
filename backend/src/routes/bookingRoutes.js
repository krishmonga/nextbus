import express from "express";
import { bookBus, getUserBookings } from "../controllers/bookingController.js";
import protect from "../middleware/authmiddleware.js";

const router = express.Router();

// Route for booking a bus
router.post("/", protect, bookBus);

// Route for fetching user bookings
router.get("/", protect, getUserBookings);

export default router;

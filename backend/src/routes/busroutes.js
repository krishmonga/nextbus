import express from "express";
import {
  getBuses,
  addBus,
  checkSeatAvailability, 
} from "../controllers/buscontroller.js";  
import protect from "../middleware/authmiddleware.js";


const router = express.Router();

// Route for fetching all buses
router.get("/", getBuses);

// Route for adding a new bus
router.post("/", protect, addBus);

// Route for checking seat availability
router.get("/availability", protect, checkSeatAvailability); 

export default router;
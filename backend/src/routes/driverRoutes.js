import express from 'express';
import { updateLocation } from '../controllers/driverController.js';
import { protect, driverOnly } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/location', protect, driverOnly, updateLocation);

export default router;
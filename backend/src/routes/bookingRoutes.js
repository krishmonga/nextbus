import express from 'express';
import { 
  bookBus, 
  getUserBookings, 
  cancelBooking 
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/', protect, bookBus);
router.get('/', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
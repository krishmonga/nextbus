import express from 'express';
import { 
  getAllBuses, 
  getBusStops, 
  getBusById, 
  getBusesNearLocation, 
  updateBusLocation, 
  createBus, 
  createBusStop 
} from '../controllers/buscontroller.js';
import { protect, admin } from '../middleware/authmiddleware.js';

const router = express.Router();

// Public routes
router.get('/all', getAllBuses);
router.get('/stops', getBusStops);
router.get('/nearby', getBusesNearLocation);
router.get('/:id', getBusById);

// Protected routes (require authentication)
router.post('/location', protect, updateBusLocation);

// Admin routes
router.post('/', protect, admin, createBus);
router.post('/stops', protect, admin, createBusStop);

export default router;
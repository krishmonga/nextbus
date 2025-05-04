import express from 'express';
import { 
  register, 
  login, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/authcontrollers.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
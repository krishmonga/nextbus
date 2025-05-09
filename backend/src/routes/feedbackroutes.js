import express from 'express';
import { 
  submitFeedback, 
  getUserFeedback,
  getFeedbackDetails,
  updateFeedback,
  deleteFeedback,
  getAdminFeedback,
  updateFeedbackStatus,
  getFeedbackStats
} from '../controllers/feedbackcontroller.js';
import { protect, admin } from '../middleware/authmiddleware.js';

const router = express.Router();

// Submit feedback (requires login)
router.post('/', protect, submitFeedback);

// Get all feedback (admin only)
router.get('/all', protect, admin, getAdminFeedback);

// Get user's feedback (requires login)
router.get('/user', protect, getUserFeedback);

// Get feedback details (requires login)
router.get('/:id', protect, getFeedbackDetails);

// Update feedback (requires login)
router.put('/:id', protect, updateFeedback);

// Delete feedback (requires login)
router.delete('/:id', protect, deleteFeedback);

// Admin: Get all feedback with pagination and filters
router.get('/', protect, admin, getAdminFeedback);

// Admin: Update feedback status and response
router.put('/admin/:id', protect, admin, updateFeedbackStatus);

// Admin: Get feedback statistics
router.get('/stats', protect, admin, getFeedbackStats);

export default router;

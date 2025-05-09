import asyncHandler from 'express-async-handler';
import Feedback from '../models/feedback.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private
export const submitFeedback = asyncHandler(async (req, res) => {
  const {
    busId,
    driverId,
    bookingId,
    type,
    rating,
    title,
    description,
    images
  } = req.body;

  // Validate the feedback type
  if (!['rating', 'issue', 'suggestion', 'general'].includes(type)) {
    res.status(400);
    throw new Error('Invalid feedback type');
  }

  // If feedback is related to a booking, verify the booking belongs to the user
  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }
    
    if (booking.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You are not authorized to provide feedback for this booking');
    }
  }

  // Create new feedback
  const feedback = await Feedback.create({
    userId: req.user._id,
    busId,
    driverId,
    bookingId,
    type,
    rating: type === 'rating' ? rating : undefined,
    title,
    description,
    images: images || []
  });

  if (feedback) {
    res.status(201).json({
      _id: feedback._id,
      type: feedback.type,
      status: feedback.status,
      createdAt: feedback.createdAt
    });
  } else {
    res.status(400);
    throw new Error('Invalid feedback data');
  }
});

// @desc    Get user's feedback history
// @route   GET /api/feedback
// @access  Private
export const getUserFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('busId', 'name number')
    .populate('driverId', 'firstName lastName')
    .populate('bookingId', 'bookingNumber travelDate');

  res.json(feedback);
});

// @desc    Get feedback details
// @route   GET /api/feedback/:id
// @access  Private
export const getFeedbackDetails = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id)
    .populate('busId', 'name number')
    .populate('driverId', 'firstName lastName')
    .populate('bookingId', 'bookingNumber travelDate');

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  // Check if the feedback belongs to the user
  if (feedback.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to access this feedback');
  }

  res.json(feedback);
});

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private
export const updateFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  // Check if the feedback belongs to the user
  if (feedback.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this feedback');
  }

  // Only allow updates if feedback is pending
  if (feedback.status !== 'pending') {
    res.status(400);
    throw new Error('Cannot update feedback that is already being processed');
  }

  // Update fields
  const {
    type,
    rating,
    title,
    description,
    images
  } = req.body;

  feedback.type = type || feedback.type;
  if (type === 'rating' && rating) {
    feedback.rating = rating;
  }
  feedback.title = title || feedback.title;
  feedback.description = description || feedback.description;
  if (images) {
    feedback.images = images;
  }

  const updatedFeedback = await feedback.save();

  res.json({
    _id: updatedFeedback._id,
    type: updatedFeedback.type,
    status: updatedFeedback.status,
    updatedAt: updatedFeedback.updatedAt
  });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
export const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  // Check if the feedback belongs to the user
  if (feedback.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this feedback');
  }

  // Only allow deletion if feedback is pending
  if (feedback.status !== 'pending') {
    res.status(400);
    throw new Error('Cannot delete feedback that is already being processed');
  }

  await feedback.deleteOne();

  res.json({ message: 'Feedback removed' });
});

// @desc    Admin: Get all feedback
// @route   GET /api/feedback/admin
// @access  Private/Admin
export const getAdminFeedback = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const status = req.query.status || null;
  const type = req.query.type || null;

  let query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (type) {
    query.type = type;
  }

  const count = await Feedback.countDocuments(query);
  
  const feedback = await Feedback.find(query)
    .populate('userId', 'firstName lastName email')
    .populate('busId', 'name number')
    .populate('driverId', 'firstName lastName')
    .populate('bookingId', 'bookingNumber travelDate')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    feedback,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Admin: Update feedback status
// @route   PUT /api/feedback/admin/:id
// @access  Private/Admin
export const updateFeedbackStatus = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error('Feedback not found');
  }

  const { status, adminResponse } = req.body;

  feedback.status = status || feedback.status;
  
  if (adminResponse) {
    feedback.adminResponse = {
      text: adminResponse,
      respondedBy: req.user._id,
      respondedAt: Date.now()
    };
  }

  const updatedFeedback = await feedback.save();

  // If feedback is now resolved, we could notify the user via email/SMS
  if (status === 'resolved') {
    // Send notification logic would go here
  }

  res.json({
    _id: updatedFeedback._id,
    status: updatedFeedback.status,
    adminResponse: updatedFeedback.adminResponse
  });
});

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private/Admin
export const getFeedbackStats = asyncHandler(async (req, res) => {
  // Count by status
  const statusCounts = await Feedback.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Count by type
  const typeCounts = await Feedback.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Average ratings
  const averageRatings = await Feedback.aggregate([
    {
      $match: { type: 'rating' }
    },
    {
      $group: {
        _id: null,
        avgOverall: { $avg: '$rating.overall' },
        avgTimeliness: { $avg: '$rating.timeliness' },
        avgCleanliness: { $avg: '$rating.cleanliness' },
        avgDriverBehavior: { $avg: '$rating.driverBehavior' },
        avgComfort: { $avg: '$rating.comfort' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Format the stats
  const stats = {
    status: statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    type: typeCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {}),
    ratings: averageRatings.length > 0 ? averageRatings[0] : {
      avgOverall: 0,
      avgTimeliness: 0,
      avgCleanliness: 0,
      avgDriverBehavior: 0,
      avgComfort: 0,
      count: 0
    }
  };

  res.json(stats);
});
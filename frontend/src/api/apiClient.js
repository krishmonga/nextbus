import apiClient from '../api/apiClient';

// Submit feedback using apiClient for consistent baseURL and headers
export const submitFeedback = async (feedbackData) => {
  try {
    console.log('Submitting feedback data:', feedbackData);

    // Save to localStorage first as a backup
    saveFeedbackToLocalStorage(feedbackData);

    // Format data to match backend expectations
    const formattedData = {
      // Basic info
      busId: feedbackData.busId || '',
      bookingId: feedbackData.bookingId || '',
      route: feedbackData.route || '',
      
      // Rating related fields
      type: 'rating',
      rating: {
        overall: parseInt(feedbackData.rating?.overall) || 5,
        driverBehavior: parseInt(feedbackData.rating?.driverBehavior) || 5,
        cleanliness: parseInt(feedbackData.rating?.cleanliness) || 5,
        appExperience: parseInt(feedbackData.rating?.appExperience) || 5
      },
      
      // Punctuality info
      punctualityStatus: feedbackData.punctualityStatus || 'onTime',
      delayDuration: parseInt(feedbackData.delayDuration) || 0,
      
      // Other fields
      recommendBus: !!feedbackData.recommendBus, // Ensure boolean
      additionalComments: feedbackData.additionalComments || '',
      
      // Use title or create one
      title: feedbackData.title || `Feedback for ${feedbackData.route || 'trip'}`
    };

    // Correct path - NO /api prefix!
    const response = await apiClient.post('/feedback', formattedData);

    console.log('Feedback submitted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in feedback submission:', error);
    
    // Check for specific error responses
    if (error.response) {
      console.error('Server response:', error.response.status, error.response.data);
    }
    
    // If it's a server error (500), it's not the user's fault
    // We'll still count this as a success with localStorage backup
    if (error.response && error.response.status === 500) {
      console.log('Server error but feedback saved locally');
      return {
        success: true,
        message: 'Feedback saved locally',
        data: feedbackData,
      };
    }

    // For 401 Unauthorized, throw error to let apiClient handle logout
    if (error.response && error.response.status === 401) {
      throw error;
    }
    
    // For other errors, also return success with localStorage backup
    return {
      success: true,
      message: 'Feedback saved locally',
      data: feedbackData,
    };
  }
};

// Helper function to save feedback to localStorage
const saveFeedbackToLocalStorage = (feedbackData) => {
  try {
    const userFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');

    const newFeedback = {
      ...feedbackData,
      _id: `feedback-${Date.now()}`,
      createdAt: feedbackData.createdAt || new Date().toISOString()
    };

    userFeedback.unshift(newFeedback);

    // Limit storage to 20 items to prevent localStorage from getting too large
    if (userFeedback.length > 20) {
      userFeedback.length = 20;
    }

    localStorage.setItem('userFeedback', JSON.stringify(userFeedback));

    console.log('Feedback saved to localStorage successfully');
    return newFeedback;
  } catch (error) {
    console.error('Error saving feedback to localStorage:', error);
    throw error;
  }
};

// Get user feedback - use correct path without /api prefix
export const getUserFeedback = async () => {
  try {
    const response = await apiClient.get('/feedback');
    console.log('Feedback loaded from API:', response.data);
    return response.data;
  } catch (error) {
    console.log('API feedback retrieval failed, using localStorage:', error);
    
    // Fallback to localStorage
    const userFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    return { success: true, data: userFeedback };
  }
};

// Get feedback for a specific booking - use correct path without /api prefix
export const getFeedbackByBooking = async (bookingId) => {
  if (!bookingId) return { data: null };
  
  try {
    const response = await apiClient.get(`/feedback/booking/${bookingId}`);
    return response.data;
  } catch (error) {
    console.log('API booking feedback retrieval failed, using localStorage:', error);
    
    // Fallback to localStorage
    const userFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    const feedback = userFeedback.find(f => f.bookingId === bookingId);
    return { success: true, data: feedback || null };
  }
};
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { 
  Clock, 
  Bus, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  ChevronLeft,
  Star
} from 'lucide-react';
import { submitFeedback } from '../stores/feedbackservice';

const BusFeedbackForm = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { bookingId, busId } = useParams();
  
  // State for form data
  const [feedbackData, setFeedbackData] = useState({
    userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
    busId: busId || '',
    bookingId: bookingId || '',
    route: '',
    punctualityStatus: '',
    delayDuration: 0,
    rating: {
      overall: 5,
      driverBehavior: 5,
      cleanliness: 5,
      appExperience: 5
    },
    additionalComments: '',
    recommendBus: true,
    type: 'rating'
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState([]);

  // Punctuality options
  const punctualityOptions = [
    { value: 'early', label: 'Bus was Early' },
    { value: 'onTime', label: 'Bus was On Time' },
    { value: 'late', label: 'Bus was Late' }
  ];

  // Fetch booking details if bookingId exists
// Update the useEffect for fetching booking details

useEffect(() => {
  const fetchBookingDetails = async () => {
    if (!bookingId) return;
    
    try {
      // Get the booking details from localStorage instead of making an API call
      // This is more reliable for this demo app where the backend might not be available
      const bookedTrips = JSON.parse(localStorage.getItem('bookedTrips') || '[]');
      const booking = bookedTrips.find(trip => trip.id === bookingId);
      
      if (booking) {
        // Set the route information from localStorage data
        setFeedbackData(prev => ({
          ...prev,
          busId: busId || booking.busId || '',
          route: booking.route || `${booking.from || ''} → ${booking.to || ''}`,
        }));
        
        console.log('Loaded booking details from localStorage:', booking);
      } else {
        console.log('Booking not found in localStorage, setting route from URL params if available');
        
        // If no specific booking found, try to find the bus info
        if (busId) {
          const busOptions = [
            { id: 1, name: 'Shimla-Manali Express', route: 'Shimla → Mandi → Kullu → Manali' },
            { id: 2, name: 'Dharamshala-McLeodganj Shuttle', route: 'Dharamshala → McLeodganj' },
            { id: 3, name: 'Dalhousie Express', route: 'Pathankot → Dalhousie' },
            { id: 4, name: 'Shimla Local', route: 'Mall Road Circuit' },
            { id: 5, name: 'Kinnaur Valley Express', route: 'Shimla → Rampur → Kalpa' },
            { id: 6, name: 'JUIT-Shimla Shuttle', route: 'JUIT → Shimla' },
            { id: 7, name: 'JUIT-Waknaghat Express', route: 'JUIT → Waknaghat' },
            { id: 8, name: 'JUIT-Solan Connector', route: 'JUIT → Solan' }
          ];
          
          const bus = busOptions.find(b => b.id.toString() === busId.toString());
          
          if (bus) {
            setFeedbackData(prev => ({
              ...prev,
              route: bus.route
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Could not load booking details');
    }
  };
  
  fetchBookingDetails();
}, [bookingId, busId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFeedbackData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle rating change
  const handleRatingChange = (name, value) => {
    setFeedbackData(prev => ({
      ...prev,
      rating: {
        ...prev.rating,
        [name]: value
      }
    }));
  };

  // Handle recommend toggle
  const handleRecommendToggle = (value) => {
    setFeedbackData(prev => ({
      ...prev,
      recommendBus: value
    }));
  };

  // Handle form submission
// Update the handleSubmit function in your FeedbackPage.jsx
  
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate required fields
  if (!feedbackData.userName || !feedbackData.punctualityStatus) {
    toast.error('Please fill in all required fields');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Add a timestamp to the feedback data
    const submissionData = {
      ...feedbackData,
      createdAt: new Date().toISOString()
    };
    
    const response = await submitFeedback(submissionData);
    console.log('Feedback submitted successfully:', response);
    
    setIsSubmitted(true);
    toast.success('Thank you for your feedback!');
    
    // Provide fallback behavior in case API is unavailable
    const tempSaveToLocalStorage = () => {
      try {
        // Get existing feedback from localStorage or initialize empty array
        const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
        
        // Add the new feedback with a temp ID
        const newFeedback = {
          ...submissionData,
          _id: `temp-${Date.now()}`
        };
        
        // Save back to localStorage
        localStorage.setItem('userFeedback', JSON.stringify([newFeedback, ...existingFeedback]));
        console.log('Feedback saved to localStorage as fallback');
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    };
    
    // Save to localStorage as backup
    tempSaveToLocalStorage();
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFeedbackData({
        userName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
        busId: '',
        bookingId: '',
        route: '',
        punctualityStatus: '',
        delayDuration: 0,
        rating: {
          overall: 5,
          driverBehavior: 5,
          cleanliness: 5,
          appExperience: 5
        },
        additionalComments: '',
        recommendBus: true,
        type: 'rating'
      });
      setIsSubmitted(false);
      
      // Redirect to dashboard
      navigate('/dashboard');
    }, 2000);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    // More specific error messages based on error type
    if (error.response) {
      // The request was made and the server responded with an error status
      if (error.response.status === 404) {
        toast.error('Feedback service is currently unavailable. We saved your feedback locally and will submit later.');
        
        // Save to localStorage as fallback
        try {
          const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
          const newFeedback = {
            ...feedbackData,
            _id: `temp-${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('userFeedback', JSON.stringify([newFeedback, ...existingFeedback]));
          
          // Show success and navigate
          setIsSubmitted(true);
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } catch (err) {
          console.error('Error saving to localStorage:', err);
        }
      } else if (error.response.status === 401) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error(`Error: ${error.response.data.message || 'Failed to submit feedback'}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error('No response from server. Check your internet connection.');
    } else {
      toast.error('Failed to submit feedback. Please try again.');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  // Rating component
  const RatingStars = ({ name, value, onChange, label }) => {
    return (
      <div className="space-y-2">
        <label className="text-gray-900 font-semibold flex justify-between">
          <span>{label}</span>
          <span className="text-indigo-600 font-bold">{value}/10</span>
        </label>
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(name, rating)}
              className={`h-8 w-8 rounded-md flex items-center justify-center transition-all ${
                rating <= value 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={`Rate ${rating} out of 10`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
          <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 text-xl font-semibold flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="mr-2 h-6 w-6" /> 
            Bus Experience Feedback
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-normal bg-white/20 py-1 px-3 rounded-md hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>
        
        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">Your feedback has been submitted successfully.</p>
            <div className="mx-auto w-32 h-1 bg-indigo-100 rounded-full mb-6"></div>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-gray-900 font-semibold">
                  Your Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900 placeholder-gray-400 font-medium"
                  name="userName"
                  value={feedbackData.userName}
                  onChange={handleInputChange}
                  placeholder="Enter Your Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-900 font-semibold">
                  <Bus className="mr-2 h-5 w-5 text-indigo-500" /> 
                  Route
                </label>
                <input
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg bg-gray-50 text-gray-900 cursor-not-allowed font-medium"
                  name="route"
                  value={feedbackData.route}
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-gray-900 font-semibold">
                <Clock className="mr-2 h-5 w-5 text-indigo-500" /> 
                Punctuality <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-900 font-medium appearance-none"
                name="punctualityStatus"
                value={feedbackData.punctualityStatus}
                onChange={handleInputChange}
                required
              >
                <option value="" className="text-gray-900 font-medium">Select Punctuality Status</option>
                {punctualityOptions.map(option => (
                  <option key={option.value} value={option.value} className="text-gray-900 font-medium">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {feedbackData.punctualityStatus === 'late' && (
              <div className="space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-100 animate-fadeIn">
                <label className="text-gray-900 font-semibold">
                  Delay Duration (in minutes)
                </label>
                <input
                  className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition bg-white text-gray-900 font-medium"
                  type="number"
                  name="delayDuration"
                  value={feedbackData.delayDuration}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter delay duration"
                  required
                />
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Rate Your Experience
              </h3>
              
              <div className="space-y-6">
                <RatingStars 
                  name="overall" 
                  value={feedbackData.rating.overall} 
                  onChange={handleRatingChange} 
                  label="Overall Experience" 
                />

                <RatingStars 
                  name="appExperience" 
                  value={feedbackData.rating.appExperience} 
                  onChange={handleRatingChange} 
                  label="App Experience" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-900 font-semibold">Would you recommend this bus service?</label>
              <div className="flex space-x-4 mt-2">
                <button
                  type="button"
                  onClick={() => handleRecommendToggle(true)}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition ${
                    feedbackData.recommendBus 
                      ? 'bg-green-100 text-green-700 border-2 border-green-500 shadow-md' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span>Yes</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRecommendToggle(false)}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition ${
                    feedbackData.recommendBus === false
                      ? 'bg-red-100 text-red-700 border-2 border-red-500 shadow-md'
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsDown className="h-5 w-5" />
                  <span>No</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-900 font-semibold">Additional Comments</label>
                              <textarea
                className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition min-h-[120px] bg-white text-gray-900 placeholder-gray-400 font-medium"
                name="additionalComments"
                value={feedbackData.additionalComments}
                onChange={handleInputChange}
                placeholder="Share more details about your experience..."
              />
            </div>

            <button 
              type="submit" 
              className={`w-full flex items-center justify-center font-medium py-3 px-4 rounded-lg transition-all ${
                isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusFeedbackForm;
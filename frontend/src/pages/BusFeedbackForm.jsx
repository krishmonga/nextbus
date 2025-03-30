import React, { useState } from 'react';
import { 
  Clock, 
  Bus, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  X
} from 'lucide-react';

const BusFeedbackForm = () => {
  const [feedbackData, setFeedbackData] = useState({
    userName: '',
    route: '',
    punctualityStatus: '',
    delayDuration: 0,
    overallExperience: 5,
    driverBehavior: 5,
    cleanliness: 5,
    additionalComments: '',
    recommendBus: null
  });

  const [isVisible, setIsVisible] = useState(true);

  const punctualityOptions = [
    { value: 'early', label: 'Bus was Early' },
    { value: 'onTime', label: 'Bus was On Time' },
    { value: 'late', label: 'Bus was Late' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedbackData.userName || !feedbackData.route || !feedbackData.punctualityStatus) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Feedback Submitted:', feedbackData);
    alert('Thank you for your feedback!');
  };

  if (!isVisible) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0"></div>
      
      <div className="w-full max-w-md z-10 shadow-2xl border-none bg-white rounded-xl p-6 relative">
        <button onClick={() => setIsVisible(false)} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
          <X className="h-6 w-6" />
        </button>
        
        <div className="bg-blue-600 text-white rounded-t-xl p-4 text-lg font-semibold flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" /> 
          Bus Experience Feedback
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              User Name
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              name="userName"
              value={feedbackData.userName}
              onChange={handleInputChange}
              placeholder="Enter Your Name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <Bus className="mr-2 h-5 w-5 text-gray-500" /> 
              Route
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
              name="route"
              value={feedbackData.route}
              onChange={handleInputChange}
              placeholder="Enter Bus Route"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium">
              <Clock className="mr-2 h-5 w-5 text-gray-500" /> 
              Punctuality
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              name="punctualityStatus"
              value={feedbackData.punctualityStatus}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Punctuality Status</option>
              {punctualityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {feedbackData.punctualityStatus === 'late' && (
            <div className="space-y-2">
              <label className="text-gray-700 font-medium">
                Delay Duration (in minutes)
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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

          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Additional Comments</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px] bg-white text-gray-700 placeholder-gray-500 focus:bg-white focus:text-black backdrop-blur-md"
              name="additionalComments"
              value={feedbackData.additionalComments}
              onChange={handleInputChange}
              placeholder="Share more details about your experience"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusFeedbackForm;

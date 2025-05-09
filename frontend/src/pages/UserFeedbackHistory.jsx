import React, { useState, useEffect } from 'react';
import { getUserFeedback } from '../services/feedbackService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const UserFeedbackHistory = () => {
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getUserFeedback();
        setFeedbackHistory(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching feedback history:', error);
        setError('Failed to load your feedback history');
        setIsLoading(false);
        toast.error('Could not load feedback history');
      }
    };

    fetchFeedbackHistory();
  }, []);

  // Format punctuality status for display
  const formatPunctuality = (status) => {
    switch (status) {
      case 'early': return 'Early';
      case 'onTime': return 'On Time';
      case 'late': return 'Late';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3">Loading your feedback history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (feedbackHistory.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg text-center border border-gray-200">
        <p className="text-gray-600">You haven't submitted any feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Your Feedback History</h2>
      
      <div className="space-y-4">
        {feedbackHistory.map((feedback) => (
          <div 
            key={feedback._id} 
            className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-800">
                  {feedback.route}
                </h3>
                <p className="text-sm text-gray-500">
                  Submitted on {format(new Date(feedback.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              
              <div className="flex items-center">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  feedback.recommendBus 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {feedback.recommendBus ? 'Recommended' : 'Not Recommended'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Overall</p>
                <p className="font-medium">{feedback.overallExperience}/10</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Driver</p>
                <p className="font-medium">{feedback.driverBehavior}/10</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cleanliness</p>
                <p className="font-medium">{feedback.cleanliness}/10</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">Punctuality</p>
              <p className={`font-medium ${
                feedback.punctualityStatus === 'late' 
                  ? 'text-red-600' 
                  : feedback.punctualityStatus === 'early' 
                    ? 'text-yellow-600' 
                    : 'text-green-600'
              }`}>
                {formatPunctuality(feedback.punctualityStatus)}
                {feedback.punctualityStatus === 'late' && feedback.delayDuration > 0 && 
                  ` (${feedback.delayDuration} minutes)`
                }
              </p>
            </div>
            
            {feedback.additionalComments && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Your Comments</p>
                <p className="mt-1 text-gray-700">{feedback.additionalComments}</p>
              </div>
            )}
            
            {feedback.adminResponse && (
              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700">Response from Admin:</p>
                <p className="mt-1 text-gray-700">{feedback.adminResponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFeedbackHistory;
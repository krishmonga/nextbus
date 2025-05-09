import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define API functions locally instead of importing them
const getAllFeedback = async (filters) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: filters
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getFeedbackStats = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const respondToFeedback = async (feedbackId, response, resolved) => {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/feedback/${feedbackId}/respond`,
      { response, resolved },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return result.data;
  } catch (error) {
    throw error;
  }
};

const FeedbackDashboard = () => {
  // State for feedback list
  const [feedbackList, setFeedbackList] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0
  });
  
  // State for feedback stats
  const [stats, setStats] = useState(null);
  
  // State for selected feedback to respond to
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');
  
  // State for filters
  const [filters, setFilters] = useState({
    route: '',
    punctualityStatus: '',
    minRating: '',
    resolved: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });
  
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch feedback data
  const fetchFeedbackData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch feedback list
      const listResponse = await getAllFeedback({
        ...filters,
        page: filters.page
      });
      
      setFeedbackList(listResponse.feedback);
      setPagination(listResponse.pagination);
      
      // Fetch feedback stats
      const statsResponse = await getFeedbackStats();
      setStats(statsResponse);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data');
      setIsLoading(false);
      toast.error('Could not load feedback data');
    }
  };
  
  // Effect to fetch data on mount and when filters change
  useEffect(() => {
    fetchFeedbackData();
  }, [filters.page, filters.limit]);
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page on filter change
    }));
  };
  
  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    fetchFeedbackData();
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      route: '',
      punctualityStatus: '',
      minRating: '',
      resolved: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 10
    });
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };
  
  // Open response modal
  const openResponseModal = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.adminResponse || '');
  };
  
  // Close response modal
  const closeResponseModal = () => {
    setSelectedFeedback(null);
    setResponseText('');
  };
  
  // Submit response
  const submitResponse = async () => {
    if (!selectedFeedback) return;
    
    setIsSubmitting(true);
    
    try {
      await respondToFeedback(selectedFeedback._id, responseText, true);
      
      toast.success('Response submitted successfully');
      
      // Update the feedback in the list
      setFeedbackList(prev => 
        prev.map(item => 
          item._id === selectedFeedback._id 
            ? { ...item, adminResponse: responseText, resolved: true } 
            : item
        )
      );
      
      closeResponseModal();
    } catch (err) {
      console.error('Error submitting response:', err);
      toast.error('Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!stats) return null;
    
    return {
      punctualityChart: {
        labels: ['Early', 'On Time', 'Late'],
        datasets: [
          {
            label: 'Bus Punctuality',
            data: [
              stats.punctuality.early || 0,
              stats.punctuality.onTime || 0,
              stats.punctuality.late || 0
            ],
            backgroundColor: [
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      
      ratingsChart: {
        labels: ['Overall', 'Driver', 'Cleanliness'],
        datasets: [
          {
            label: 'Average Ratings',
            data: [
              stats.averageRatings.avgOverall || 0,
              stats.averageRatings.avgDriver || 0,
              stats.averageRatings.avgCleanliness || 0
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      
      routePerformanceChart: {
        labels: stats.routePerformance.slice(0, 5).map(route => route._id),
        datasets: [
          {
            label: 'Average Rating',
            data: stats.routePerformance.slice(0, 5).map(route => route.avgRating),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Feedback Count',
            data: stats.routePerformance.slice(0, 5).map(route => route.count),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            type: 'line',
            yAxisID: 'y1'
          }
        ]
      },
      
      trendsChart: {
        labels: stats.recentTrends.map(trend => 
          `${trend._id.month}/${trend._id.day}`
        ),
        datasets: [
          {
            label: 'Average Rating',
            data: stats.recentTrends.map(trend => trend.avgRating),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Feedback Count',
            data: stats.recentTrends.map(trend => trend.count),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'transparent',
            type: 'line'
          }
        ]
      }
    };
  };
  
  // Format punctuality status for display
  const formatPunctuality = (status) => {
    switch (status) {
      case 'early': return 'Early';
      case 'onTime': return 'On Time';
      case 'late': return 'Late';
      default: return status;
    }
  };
  
  const chartData = prepareChartData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Feedback Dashboard</h1>
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm uppercase tracking-wide mb-1">Total Feedback</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.totalFeedback}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm uppercase tracking-wide mb-1">Recommendation Rate</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.recommendationRate.toFixed(1)}%</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm uppercase tracking-wide mb-1">Average Rating</h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.averageRatings.avgOverall ? stats.averageRatings.avgOverall.toFixed(1) : 'N/A'}/10
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm uppercase tracking-wide mb-1">On-Time Rate</h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalFeedback ? 
                ((stats.punctuality.onTime / stats.totalFeedback) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      )}
      
      {/* Charts */}
      {stats && chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Punctuality Breakdown</h2>
            <div className="h-64">
              <Pie 
                data={chartData.punctualityChart} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Average Ratings by Category</h2>
            <div className="h-64">
              <Bar 
                data={chartData.ratingsChart} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Top 5 Routes by Performance</h2>
            <div className="h-80">
              <Bar 
                data={chartData.routePerformanceChart} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10,
                      type: 'linear',
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Average Rating'
                      }
                    },
                    y1: {
                      beginAtZero: true,
                      type: 'linear',
                      position: 'right',
                      grid: {
                        drawOnChartArea: false
                      },
                      title: {
                        display: true,
                        text: 'Feedback Count'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Recent Trends (Last 30 Days)</h2>
            <div className="h-80">
              <Line 
                data={chartData.trendsChart} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filter Feedback</h2>
        
        <form onSubmit={applyFilters} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
            <input
              type="text"
              name="route"
              value={filters.route}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filter by route"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Punctuality</label>
            <select
              name="punctualityStatus"
              value={filters.punctualityStatus}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="early">Early</option>
              <option value="onTime">On Time</option>
              <option value="late">Late</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Ratings</option>
              <option value="8">8 and above</option>
              <option value="5">5 and above</option>
              <option value="3">Below 5</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resolved Status</label>
            <select
              name="resolved"
              value={filters.resolved}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="true">Resolved</option>
              <option value="false">Unresolved</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="md:col-span-3 flex space-x-4 mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Apply Filters
            </button>
            
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>
      
      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold p-6 border-b">Feedback List</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading feedback...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : feedbackList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No feedback found matching your filters</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punctuality</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feedbackList.map((feedback) => (
                    <tr key={feedback._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{feedback.userName}</div>
                        <div className="text-sm text-gray-500">
                          {feedback.userId?.email || 'No email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{feedback.route}</div>
                        {feedback.busId && (
                          <div className="text-xs text-gray-500">
                            Bus: {feedback.busId.name || feedback.busId.number || 'Unknown'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                            feedback.overallExperience >= 8 
                              ? 'bg-green-100 text-green-800' 
                              : feedback.overallExperience >= 5 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {feedback.overallExperience}
                          </span>
                          <span className="ml-2">
                            {feedback.recommendBus ? '👍' : '👎'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          feedback.punctualityStatus === 'onTime' 
                            ? 'bg-green-100 text-green-800' 
                            : feedback.punctualityStatus === 'early' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {formatPunctuality(feedback.punctualityStatus)}
                          {feedback.punctualityStatus === 'late' && feedback.delayDuration > 0 && 
                            ` (${feedback.delayDuration}m)`
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(feedback.createdAt), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          feedback.resolved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {feedback.resolved ? 'Resolved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openResponseModal(feedback)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {feedback.adminResponse ? 'View/Edit Response' : 'Respond'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.hasPreviousPage 
                      ? 'bg-white text-gray-700 hover:bg-gray-50' 
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.hasNextPage 
                      ? 'bg-white text-gray-700 hover:bg-gray-50' 
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.currentPage - 1) * filters.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * filters.limit, pagination.totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.totalItems}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPreviousPage}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        pagination.hasPreviousPage 
                          ? 'bg-white text-gray-500 hover:bg-gray-50' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        pagination.hasNextPage 
                          ? 'bg-white text-gray-500 hover:bg-gray-50' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Response Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Respond to Feedback</h3>
                <button
                  onClick={closeResponseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-2">Feedback Details</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium">{selectedFeedback.userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {format(new Date(selectedFeedback.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{selectedFeedback.route}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Overall Rating</p>
                      <p className="font-medium">{selectedFeedback.overallExperience}/10</p>
                    </div>
                  </div>
                  
                  {selectedFeedback.additionalComments && (
                    <div>
                      <p className="text-sm text-gray-500">Comments</p>
                      <p className="mt-1 text-gray-700">{selectedFeedback.additionalComments}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="responseText" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Response
                </label>
                <textarea
                  id="responseText"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Enter your response to the customer..."
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeResponseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  disabled={isSubmitting || !responseText.trim()}
                  className={`px-4 py-2 rounded-md text-white ${
                    isSubmitting || !responseText.trim() 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackDashboard;
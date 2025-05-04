import axios from "axios";
import toast from "react-hot-toast";

// Backend Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// Add a request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Handle authentication errors
    if (statusCode === 401) {
      // Don't show toast for initial auth checks
      const isAuthEndpoint = error.config?.url?.includes('/auth');
      if (!isAuthEndpoint) {
        toast.error('Your session has expired. Please log in again');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (statusCode >= 500) {
      toast.error('Server error. Please try again later');
    } else if (statusCode === 404) {
      toast.error('Resource not found');
    } else if (message) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
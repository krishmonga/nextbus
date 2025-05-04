import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await login(formData);
      
      if (success) {
        // Redirect to the page user was trying to access, or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md m-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Log in to NextBus
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label 
              htmlFor="email" 
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                        ${errors.email ? 'border-red-500 focus:ring-red-500' : 
                         'border-gray-300 focus:ring-blue-500'}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white
                        ${errors.password ? 'border-red-500 focus:ring-red-500' : 
                         'border-gray-300 focus:ring-blue-500'}`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 text-white font-medium rounded-lg focus:outline-none focus:ring-2 
                      focus:ring-offset-2 focus:ring-blue-500
                      ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 
                       'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
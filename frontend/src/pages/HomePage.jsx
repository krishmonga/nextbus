import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const HomePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLoginRedirect = (path) => {
    if (!user) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Real-time Bus Tracking & Transportation Solutions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Track college and local buses in real-time, book taxis, and find carpools - all in one place.
        </p>
        
        {/* Quick Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => navigate('/bus-tracking')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Track Buses Now
          </button>
          <button 
            onClick={() => navigate('/map')}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            View Live Map
          </button>
        </div>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Bus Tracking</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Track your bus in real-time and never miss a ride. Get accurate ETAs and route information.
          </p>
          <Link to="/bus-tracking" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Track Now →
          </Link>
        </div>

        <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Taxi Booking</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Book a taxi in advance or on-demand. Get fare estimates and track your driver.
          </p>
          <Link to="/taxi-booking" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Book a Taxi →
          </Link>
        </div>

        <div className="card p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all">
          <div className="h-12 w-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Carpool</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Find or offer rides to share costs and reduce your carbon footprint.
          </p>
          <Link to="/carpool" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Find a Ride →
          </Link>
        </div>
      </div>

      {/* Driver Section - New */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-8 mb-12">
        <div className="md:flex items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-3">
              For Drivers
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bus Drivers: Share Your Location
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Help passengers track your bus in real-time by sharing your location. Easy to use and battery-efficient.
            </p>
          </div>
          <div>
            <Link 
              to="/driver" 
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Driver Dashboard →
            </Link>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="bg-primary-50 dark:bg-gray-800 rounded-lg p-8 mb-12">
        <div className="md:flex items-center justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Download our mobile app
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Get the full experience with our mobile app. Track buses, book taxis, and find carpools on the go.
            </p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg inline-block transition-all">
              App Store
            </a>
            <a href="#" className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg inline-block transition-all">
              Google Play
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Why Choose Next Bus?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">100+</div>
            <p className="text-gray-600 dark:text-gray-300">Bus routes tracked</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">50K+</div>
            <p className="text-gray-600 dark:text-gray-300">Active users</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">10K+</div>
            <p className="text-gray-600 dark:text-gray-300">Taxi rides per month</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">5K+</div>
            <p className="text-gray-600 dark:text-gray-300">Carpool matches</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center p-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6 max-w-2xl mx-auto">Join thousands of users who rely on Next Bus for their daily commute.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-white text-primary-700 hover:bg-gray-100 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Sign Up Free
          </button>
          <button 
            onClick={() => navigate('/bus-tracking')}
            className="px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded-lg transition-all shadow-lg hover:shadow-xl border border-primary-400"
          >
            Try Bus Tracking
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
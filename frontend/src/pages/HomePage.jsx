import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Real-time Bus Tracking & Transportation Solutions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Track college and local buses in real-time, book taxis, and find carpools - all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card p-6">
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

        <div className="card p-6">
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

        <div className="card p-6">
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
            <a href="#" className="btn btn-primary">
              App Store
            </a>
            <a href="#" className="btn btn-secondary">
              Google Play
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Why Choose Next Bus?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">100+</div>
            <p className="text-gray-600 dark:text-gray-300">Bus routes tracked</p>
          </div>
          <div className="p-4">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">50K+</div>
            <p className="text-gray-600 dark:text-gray-300">Active users</p>
          </div>
          <div className="p-4">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">10K+</div>
            <p className="text-gray-600 dark:text-gray-300">Taxi rides per month</p>
          </div>
          <div className="p-4">
            <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold mb-2">5K+</div>
            <p className="text-gray-600 dark:text-gray-300">Carpool matches</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
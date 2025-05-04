import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const DriverDashboardPage = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('trips');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeStats, setRouteStats] = useState({
    totalTrips: 0,
    totalDistance: 0,
    averageRating: 0
  });
  
  // Mock trips data (would come from API)
  const [trips, setTrips] = useState([
    {
      id: 1,
      date: new Date(),
      route: 'JUIT → Waknaghat',
      duration: '45 minutes',
      distance: '15 km',
      status: 'Completed',
      passengers: 12
    },
    {
      id: 2,
      date: new Date(Date.now() - 86400000), // Yesterday
      route: 'JUIT → Solan',
      duration: '1 hour 15 minutes',
      distance: '28 km',
      status: 'Completed',
      passengers: 18
    },
    {
      id: 3, 
      date: new Date(Date.now() + 86400000), // Tomorrow
      route: 'JUIT → Shimla',
      duration: '2 hours',
      distance: '45 km',
      status: 'Scheduled',
      passengers: 22
    }
  ]);
  
  // Get current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    
    // Calculate stats from trips data
    const completed = trips.filter(trip => trip.status === 'Completed');
    setRouteStats({
      totalTrips: completed.length,
      totalDistance: completed.reduce((total, trip) => total + parseInt(trip.distance), 0),
      averageRating: 4.7 // Mock data
    });
  }, [trips]);
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Driver Dashboard</h1>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h2 className="text-xl font-semibold">Welcome, {user?.firstName || 'Driver'}!</h2>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              {user?.status === 'available' ? 'You are currently available for trips.' : 
               user?.status === 'busy' ? 'You are currently on a route.' : 
               'You are currently offline.'}
            </p>
          </div>
          <Link 
            to="/driver/location" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors mt-2 sm:mt-0"
          >
            Start Location Sharing
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Trips</h3>
          <p className="text-2xl font-bold">{routeStats.totalTrips}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Total Distance</h3>
          <p className="text-2xl font-bold">{routeStats.totalDistance} km</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Average Rating</h3>
          <p className="text-2xl font-bold">{routeStats.averageRating} ⭐</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'trips' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('trips')}
            >
              Trips
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'schedule' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              Schedule
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'profile' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </nav>
        </div>
        
        <div className="p-4">
          {activeTab === 'trips' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Trips</h2>
              {trips.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Distance
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {trips.map(trip => (
                        <tr key={trip.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {formatDate(trip.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {trip.route}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {trip.duration}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {trip.distance}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              trip.status === 'Completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                              {trip.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No trips found.</p>
              )}
            </div>
          )}
          
          {activeTab === 'schedule' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Schedule</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Upcoming Trips</h3>
                {trips.filter(trip => trip.status === 'Scheduled').length > 0 ? (
                  trips.filter(trip => trip.status === 'Scheduled').map(trip => (
                    <div key={trip.id} className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 mb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{trip.route}</span>
                        <span>{formatDate(trip.date)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>Duration: {trip.duration}</span>
                        <span>Passengers: {trip.passengers}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No upcoming trips scheduled.</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Driver Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Name</h3>
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</h3>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</h3>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">License Number</h3>
                  <p className="font-medium">{user?.licenseNumber || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Vehicle ID</h3>
                  <p className="font-medium">{user?.vehicleId || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Experience</h3>
                  <p className="font-medium">{user?.experience || 'Not provided'} years</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboardPage;
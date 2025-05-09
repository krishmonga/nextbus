import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBusStore } from '../stores/busstore';
import { useGeolocation } from '../hooks/usegeolocation';

// Add bus routes data with additional details
const BUS_ROUTES = [
  { 
    id: 'route1', 
    name: 'JUIT Campus - Waknaghat', 
    operator: 'juit',
    stops: ['JUIT Campus', 'Main Gate', 'Waknaghat'],
    frequency: '15 min',
    firstBus: '7:00 AM',
    lastBus: '9:00 PM'
  },
  { 
    id: 'route2', 
    name: 'Shimla - Waknaghat', 
    operator: 'hrtc',
    stops: ['Shimla Bus Stand', 'Tara Devi', 'Shoghi', 'Waknaghat'],
    frequency: '30 min',
    firstBus: '6:00 AM',
    lastBus: '8:30 PM'
  },
  // ... other routes remain the same
];

// Add sample bus data
const SAMPLE_BUSES = {
  'route1': [
    { 
      id: 'bus1', 
      name: 'Campus Express', 
      busNumber: 'JU-101',
      operator: 'juit', 
      routeId: 'route1',
      route: 'JUIT Campus - Waknaghat',
      nextStop: 'Main Gate',
      status: 'On Time',
      eta: '5 min',
      capacity: '80%',
      location: { lat: 31.0127, lng: 77.0980 },
      lastUpdate: new Date().toISOString(),
      nextDepartures: ['9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM']
    },
    { 
      id: 'bus2', 
      name: 'Student Shuttle', 
      busNumber: 'JU-102',
      operator: 'juit', 
      routeId: 'route1',
      route: 'JUIT Campus - Waknaghat',
      nextStop: 'JUIT Campus',
      status: 'Delayed',
      eta: '12 min',
      capacity: '50%',
      location: { lat: 31.0130, lng: 77.1000 },
      lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
      nextDepartures: ['9:20 AM', '9:35 AM', '9:50 AM', '10:05 AM']
    }
  ],
  'route2': [
    { 
      id: 'bus3', 
      name: 'Shimla Express', 
      busNumber: 'HP-01-1234',
      operator: 'hrtc', 
      routeId: 'route2',
      route: 'Shimla - Waknaghat',
      nextStop: 'Shoghi',
      status: 'On Time',
      eta: '18 min',
      capacity: '70%',
      location: { lat: 31.0500, lng: 77.1200 },
      lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
      nextDepartures: ['9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM']
    }
  ]
};

const BusCard = ({ bus, onViewMap, onBookTicket }) => {
  // Calculate time ago for last update
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const lastUpdate = new Date(timestamp);
    const diffInMinutes = Math.floor((now - lastUpdate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes === 1) return '1 minute ago';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    return 'Over a day ago';
  };
  
  // Get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'On Time': return 'bg-green-100 text-green-800';
      case 'Delayed': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service': return 'bg-red-100 text-red-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };
  
  // Get color for operator
  const getOperatorColor = (operator) => {
    switch (operator) {
      case 'hrtc': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'local': return 'bg-orange-100 text-orange-800';
      case 'juit': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {bus.name} <span className="text-sm font-normal">({bus.busNumber})</span>
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${getOperatorColor(bus.operator)}`}>
            {bus.operator.toUpperCase()}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">Route: {bus.route}</p>
        <p className="text-gray-600 dark:text-gray-300">Next Stop: {bus.nextStop}</p>
        
        <div className="flex justify-between items-center mt-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bus.status)}`}>
            {bus.status}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ETA: {bus.eta}
          </span>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Last updated: {getTimeAgo(bus.lastUpdate)}
        </div>
        
        {/* Next departures */}
        <div className="mt-4 border-t pt-3 border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Next departures:
          </p>
          <div className="flex flex-wrap gap-2">
            {bus.nextDepartures.map((time, index) => (
              <span 
                key={index} 
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex gap-2">
        <button 
          onClick={() => onViewMap(bus)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Track on Map
        </button>
        <button 
          onClick={() => onBookTicket(bus)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md
                    transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Book Ticket
        </button>
      </div>
    </div>
  );
};

const RouteInfoCard = ({ route }) => {
  if (!route) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        {route.name}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Operator</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {route.operator.toUpperCase()}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Frequency</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {route.frequency}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">First Bus</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {route.firstBus}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last Bus</p>
          <p className="font-medium text-gray-800 dark:text-white">
            {route.lastBus}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Route Stops</p>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-blue-500 dark:bg-blue-400"></div>
          <ul className="space-y-4 relative">
            {route.stops.map((stop, index) => (
              <li key={index} className="pl-10 relative">
                <div className="absolute left-3.5 top-1 w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 transform -translate-x-1/2"></div>
                <p className="font-medium text-gray-800 dark:text-white">{stop}</p>
                {index < route.stops.length - 1 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(5 + Math.random() * 10)} min
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const BusTrackingPage = () => {
  const navigate = useNavigate();
  const { buses: storeBuses, fetchBuses, isLoading } = useBusStore();
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const { coordinates } = useGeolocation();
  
  // Load buses on mount
  useEffect(() => {
    fetchBuses();
    // For demo purposes, use sample data
    setFilteredBuses([]);
  }, [fetchBuses]);
  
  // Update route info when route is selected
  useEffect(() => {
    if (selectedRoute) {
      const route = BUS_ROUTES.find(r => r.id === selectedRoute);
      setRouteInfo(route);
      
      // Set buses for this route (demo data)
      const busesForRoute = SAMPLE_BUSES[selectedRoute] || [];
      setFilteredBuses(busesForRoute);
    } else {
      setRouteInfo(null);
      setFilteredBuses([]);
    }
  }, [selectedRoute]);
  
  // Handle view on map button
  const handleViewMap = (bus) => {
    // Navigate to map page with this bus centered
    navigate(`/map?bus=${bus.id}`);
  };
  
  // Handle book ticket button
  const handleBookTicket = (bus) => {
    // Instead of navigating to a separate booking page, let's navigate to the dashboard with booking params
    navigate(`/dashboard?tab=booking&busId=${bus.id}&routeId=${selectedRoute}&from=${encodeURIComponent(routeInfo.stops[0])}&to=${encodeURIComponent(routeInfo.stops[routeInfo.stops.length-1])}`);
  };
  
  // Get routes filtered by selected operator
  const getFilteredRoutes = () => {
    if (selectedOperator === 'all') {
      return BUS_ROUTES;
    }
    return BUS_ROUTES.filter(route => route.operator === selectedOperator);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Bus Tracking</h1>
      
      <div className="mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Select Your Bus Route
          </h2>
          <p className="text-blue-600 dark:text-blue-300">
            Choose your bus route to see available buses, arrival times, and booking options.
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            1. Select Bus Operator
          </label>
          <select
            value={selectedOperator}
            onChange={(e) => {
              setSelectedOperator(e.target.value);
              setSelectedRoute(''); // Reset route when operator changes
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Operators</option>
            <option value="hrtc">HRTC</option>
            <option value="juit">JUIT</option>
            <option value="private">Private</option>
            <option value="local">Local</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            2. Select Your Route
          </label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">-- Select a Route --</option>
            {getFilteredRoutes().map(route => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Route information */}
      {routeInfo && (
        <RouteInfoCard route={routeInfo} />
      )}
      
      {/* Available buses section */}
      {selectedRoute && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Available Buses on {routeInfo?.name}
            </h2>
            
            <Link
              to={`/map?route=${selectedRoute}`}
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md
                        transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500
                        dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              View Route on Map
            </Link>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {selectedRoute && filteredBuses.length === 0 ? (
            <div className="text-center my-12 text-gray-600 dark:text-gray-400">
              <p className="text-lg">No buses currently available on this route.</p>
              <p className="mt-2">Please check back later or try a different route.</p>
            </div>
          ) : selectedRoute ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuses.map(bus => (
                <BusCard 
                  key={bus.id} 
                  bus={bus} 
                  onViewMap={handleViewMap} 
                  onBookTicket={handleBookTicket}
                />
              ))}
            </div>
          ) : (
            <div className="text-center my-12 text-gray-600 dark:text-gray-400">
              <p className="text-lg">Please select a route to see available buses.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusTrackingPage;
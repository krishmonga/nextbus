import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBusStore } from '../stores/busstore';
import { useGeolocation } from '../hooks/usegeolocation';

const BusCard = ({ bus, onViewMap }) => {
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
            {bus.name}
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
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
        <button 
          onClick={() => onViewMap(bus)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md
                    transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          View on Map
        </button>
      </div>
    </div>
  );
};

const BusTrackingPage = () => {
  const { buses, fetchBuses, isLoading } = useBusStore();
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const { coordinates } = useGeolocation();
  
  // Load buses on mount
  useEffect(() => {
    fetchBuses();
  }, []);
  
  // Filter buses when search or filter changes
  useEffect(() => {
    let result = [...buses];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(bus => 
        bus.name.toLowerCase().includes(term) || 
        bus.route.toLowerCase().includes(term) ||
        bus.nextStop.toLowerCase().includes(term)
      );
    }
    
    // Filter by operator
    if (selectedOperator !== 'all') {
      result = result.filter(bus => bus.operator === selectedOperator);
    }
    
    setFilteredBuses(result);
  }, [buses, searchTerm, selectedOperator]);
  
  // Handle view on map button
  const handleViewMap = (bus) => {
    // Navigate to map page with this bus centered
    window.location.href = `/map?bus=${bus.id}`;
  };
  
  // Sort buses by distance if user location is available
  const sortByDistance = () => {
    if (!coordinates.lat || !coordinates.lng) return;
    
    const busesWithDistance = filteredBuses.map(bus => {
      const distance = calculateDistance(
        coordinates.lat, 
        coordinates.lng, 
        bus.location.lat, 
        bus.location.lng
      );
      return { ...bus, distance };
    });
    
    setFilteredBuses([...busesWithDistance].sort((a, b) => a.distance - b.distance));
  };
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Bus Tracking</h1>
      
      <div className="mb-6">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Real-time Bus Tracking
          </h2>
          <p className="text-blue-600 dark:text-blue-300">
            Track buses in real time, see their current location, and check estimated arrival times.
          </p>
          <Link
            to="/map"
            className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md
                      transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Open Live Map
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by route or bus name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                        dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">All Operators</option>
            <option value="hrtc">HRTC</option>
            <option value="juit">JUIT</option>
            <option value="private">Private</option>
            <option value="local">Local</option>
          </select>
          
          {coordinates.lat && coordinates.lng && (
            <button 
              onClick={sortByDistance}
              className="px-4 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg
                        transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500
                        dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Sort by Distance
            </button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredBuses.length === 0 ? (
            <div className="text-center my-12 text-gray-600 dark:text-gray-400">
              <p className="text-lg">No buses found matching your criteria.</p>
              <p className="mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBuses.map(bus => (
                <BusCard key={bus.id} bus={bus} onViewMap={handleViewMap} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BusTrackingPage;
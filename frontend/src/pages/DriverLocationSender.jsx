import { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from '../hooks/usegeolocation';
import { useBusStore } from '../stores/busstore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const DriverLocationSender = () => {
  const { user } = useAuthStore();
  const { updateDriverLocation, buses, fetchBuses } = useBusStore();
  const [selectedBus, setSelectedBus] = useState('');
  const [nextStop, setNextStop] = useState('');
  const [status, setStatus] = useState('On Time');
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const { coordinates, loaded, error } = useGeolocation({
    enableHighAccuracy: true,
    watch: true
  });
  
  // Load buses when component mounts
  useEffect(() => {
    fetchBuses();
  }, []);
  
  // Auto-select bus if driver only has one
  useEffect(() => {
    if (user && user.busId && buses.length > 0) {
      const driverBus = buses.find(bus => bus.id === user.busId);
      if (driverBus) {
        setSelectedBus(driverBus.id);
        setNextStop(driverBus.nextStop || '');
      }
    }
  }, [user, buses]);
  
  // Function to send location update
  const sendLocationUpdate = useCallback(async () => {
    if (!loaded || error || !coordinates.lat || !coordinates.lng) {
      toast.error('Cannot get your location. Please check GPS permissions.');
      setIsTracking(false);
      return;
    }
    
    if (!selectedBus) {
      toast.error('Please select a bus first');
      setIsTracking(false);
      return;
    }
    
    try {
      const data = {
        busId: selectedBus,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      };
      
      if (nextStop) data.nextStop = nextStop;
      if (status) data.status = status;
      
      await updateDriverLocation(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to send location:', error);
      toast.error('Failed to update location');
      setIsTracking(false);
    }
  }, [coordinates, loaded, error, selectedBus, nextStop, status, updateDriverLocation]);
  
  // Set up periodic location sending when tracking is enabled
  useEffect(() => {
    let interval;
    
    if (isTracking) {
      // Send location immediately when tracking starts
      sendLocationUpdate();
      
      // Then set up interval
      interval = setInterval(() => {
        sendLocationUpdate();
      }, 10000); // Send every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, sendLocationUpdate]);
  
  // Toggle tracking
  const toggleTracking = () => {
    setIsTracking(prevState => !prevState);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Location Sender</h1>
      
      {!loaded && (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4">
          Loading your location...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
          Error: {error.message || "Failed to get your location"}
          <p>Please make sure GPS is enabled and you've granted location permissions.</p>
        </div>
      )}
      
      {loaded && !error && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
          <p><strong>Current Location:</strong></p>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
          <p>Accuracy: {Math.round(coordinates.accuracy || 0)} meters</p>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Select Bus:</label>
          <select 
            value={selectedBus} 
            onChange={(e) => setSelectedBus(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={isTracking}
          >
            <option value="">-- Select a bus --</option>
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.name} ({bus.route})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Next Stop:</label>
          <input 
            type="text" 
            value={nextStop} 
            onChange={(e) => setNextStop(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Not Started">Not Started</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>
        
        <button 
          onClick={toggleTracking}
          className={`w-full py-2 px-4 rounded-lg ${
            isTracking 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
        
        {isTracking && (
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
            Tracking active. Location updates are being sent automatically.
          </p>
        )}
        
        {lastUpdate && (
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
            Last update: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default DriverLocationSender;
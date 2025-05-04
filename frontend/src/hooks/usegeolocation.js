import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null
  });
  
  const [watchId, setWatchId] = useState(null);

  const onSuccess = (position) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
      error: null
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      coordinates: { lat: null, lng: null },
      error: {
        code: error.code,
        message: error.message
      }
    });
  };
  
  const clearWatch = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: {
          code: 0,
          message: 'Geolocation not supported'
        }
      });
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Start continuous watching if requested
    if (options.watch !== false) {
      const id = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        {
          enableHighAccuracy: true,
          ...options
        }
      );
      
      setWatchId(id);
    }

    // Cleanup
    return () => clearWatch();
  }, []);

  return { ...location, clearWatch };
};
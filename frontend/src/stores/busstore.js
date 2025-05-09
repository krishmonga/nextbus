import { create } from 'zustand';
import * as busApi from '../api/busApi';
import toast from 'react-hot-toast';

export const useBusStore = create((set, get) => ({
  buses: [],
  busStops: [],
  selectedBus: null,
  nearbyBuses: [],
  routeBuses: [], // Added to store buses for specific routes
  isLoading: false,
  error: null,
  
  // Fetch all active buses
  fetchBuses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await busApi.getAllBuses();
      set({ 
        buses: response.data.buses, 
        isLoading: false 
      });
      return response.data.buses;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch buses', 
        isLoading: false 
      });
      return [];
    }
  },
  
  // Fetch all bus stops
  fetchBusStops: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await busApi.getBusStops();
      set({ 
        busStops: response.data.stops, 
        isLoading: false 
      });
      return response.data.stops;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch bus stops', 
        isLoading: false 
      });
      return [];
    }
  },
  
  // Fetch a specific bus by ID
  fetchBusById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await busApi.getBusById(id);
      set({ 
        selectedBus: response.data.bus, 
        isLoading: false 
      });
      return response.data.bus;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch bus details', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Fetch buses near a location
  fetchNearbyBuses: async (latitude, longitude, distance) => {
    set({ isLoading: true, error: null });
    try {
      const response = await busApi.getBusesNearLocation(latitude, longitude, distance);
      set({ 
        nearbyBuses: response.data.buses, 
        isLoading: false 
      });
      return response.data.buses;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch nearby buses', 
        isLoading: false 
      });
      return [];
    }
  },
  
  // Update bus location (for drivers)
  updateBusLocation: async (data) => {
    try {
      await busApi.updateBusLocation(data);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update bus location');
      return false;
    }
  },
  
  // Update driver location
  updateDriverLocation: async (data) => {
    try {
      await busApi.updateDriverLocation(data);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update location');
      return false;
    }
  },
  
  // Create a new bus (admin only)
  createBus: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await busApi.createBus(data);
      toast.success('Bus created successfully');
      set({ isLoading: false });
      return response.data.bus;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create bus', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Create a new bus stop (admin only)
  createBusStop: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await busApi.createBusStop(data);
      toast.success('Bus stop created successfully');
      set({ isLoading: false });
      return response.data.busStop;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to create bus stop', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Fetch buses on a specific route
  fetchBusesByRoute: async (origin, destination) => {
    set({ isLoading: true, error: null });
    try {
      // If API endpoint exists, use it
      if (busApi.getBusesByRoute) {
        const response = await busApi.getBusesByRoute(origin, destination);
        const routeBuses = response.data.buses;
        
        // Calculate additional ETAs for these buses
        const busesWithETAs = await Promise.all(routeBuses.map(async (bus) => {
          // Calculate ETA to destination if not provided
          if (!bus.etaToDestination && busApi.getBusETA) {
            try {
              // Find destination stop coordinates
              const destStop = get().busStops.find(
                stop => stop.name.toLowerCase() === destination.toLowerCase()
              );
              
              if (destStop && destStop.location) {
                const etaResponse = await busApi.getBusETA(
                  bus.id, 
                  destStop.location.lat, 
                  destStop.location.lng
                );
                return {
                  ...bus,
                  etaToDestination: etaResponse.data.eta
                };
              }
            } catch (error) {
              console.warn("Could not get ETA for bus:", error);
            }
          }
          return bus;
        }));
        
        set({ 
          routeBuses: busesWithETAs, 
          isLoading: false 
        });
        return busesWithETAs;
      } 
      // Otherwise filter existing buses
      else {
        // Filter buses by route
        const allBuses = get().buses;
        const filteredBuses = allBuses.filter(bus => {
          const route = bus.route?.toLowerCase() || '';
          return route.includes(origin.toLowerCase()) && 
                 route.includes(destination.toLowerCase());
        });
        
        set({
          routeBuses: filteredBuses,
          isLoading: false
        });
        
        return filteredBuses;
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch buses for this route', 
        isLoading: false 
      });
      return [];
    }
  },

  // Get ETA for a specific bus
  getBusETA: async (busId, destLat, destLng) => {
    if (!busApi.getBusETA) {
      // Fallback calculation if API doesn't exist
      const bus = get().buses.find(b => b.id === busId);
      if (!bus || !bus.location || !destLat || !destLng) return null;
      
      // Calculate distance
      const distance = calculateDistance(
        bus.location.lat,
        bus.location.lng,
        destLat,
        destLng
      );
      
      // Estimate time (assuming average speed of 30 km/h)
      const minutes = Math.round((distance / 30) * 60);
      
      // Format time
      if (minutes < 1) return 'Less than 1 minute';
      if (minutes < 60) return `${minutes} minutes`;
      
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} minute${mins !== 1 ? 's' : ''}` : ''}`;
    }
    
    try {
      const response = await busApi.getBusETA(busId, destLat, destLng);
      return response.data.eta;
    } catch (error) {
      console.warn("Error getting bus ETA:", error);
      return null;
    }
  }
}));

// Helper function for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
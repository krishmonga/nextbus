import { create } from 'zustand';
import * as busApi from '../api/busApi';
import toast from 'react-hot-toast';

export const useBusStore = create((set, get) => ({
  buses: [],
  busStops: [],
  selectedBus: null,
  nearbyBuses: [],
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
  }
}));
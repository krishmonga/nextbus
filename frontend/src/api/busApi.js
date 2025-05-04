import apiClient from './apiClient';

// Get all active buses
export const getAllBuses = async () => {
  return await apiClient.get('/buses/all');
};

// Get bus by ID
export const getBusById = async (id) => {
  return await apiClient.get(`/buses/${id}`);
};

// Get all bus stops
export const getBusStops = async () => {
  return await apiClient.get('/buses/stops');
};

// Get buses near a location
export const getBusesNearLocation = async (latitude, longitude, distance = 5000) => {
  return await apiClient.get(
    `/buses/nearby?latitude=${latitude}&longitude=${longitude}&distance=${distance}`
  );
};

// Update bus location (for drivers)
export const updateBusLocation = async (data) => {
  return await apiClient.post('/buses/location', data);
};

// For driver to update location
export const updateDriverLocation = async (data) => {
  return await apiClient.post('/drivers/location', data);
};

// Create a new bus (admin only)
export const createBus = async (data) => {
  return await apiClient.post('/buses', data);
};

// Create a new bus stop (admin only)
export const createBusStop = async (data) => {
  return await apiClient.post('/buses/stops', data);
};
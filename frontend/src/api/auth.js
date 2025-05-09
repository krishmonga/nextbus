import apiClient from './apiClient';

// Authentication API calls
export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};

export const logout = () => {
  return apiClient.post('/auth/logout');
};

// Add these methods for token verification
export const verifyToken = () => {
  return apiClient.get('/auth/verify');
};

export const getCurrentUser = () => {
  return apiClient.get('/auth/me');
};

// Update user profile
export const updateUser = (userData) => {
  return apiClient.put('/users/profile', userData);
};

// Update user settings
export const updateSettings = (settings) => {
  return apiClient.put('/users/settings', { settings });
};

// Change password
export const changePassword = (passwordData) => {
  return apiClient.put('/users/password', passwordData);
};
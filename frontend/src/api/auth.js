import apiClient from './apiClient';

export const login = async (credentials) => {
  return await apiClient.post('/auth/login', credentials);
};

export const register = async (userData) => {
  return await apiClient.post('/auth/register', userData);
};

export const getUserProfile = async () => {
  return await apiClient.get('/auth/profile');
};

export const updateUserProfile = async (userData) => {
  return await apiClient.put('/auth/profile', userData);
};

export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
};
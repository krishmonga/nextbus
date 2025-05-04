import { create } from 'zustand';
import * as authApi from '../api/auth';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        isLoading: false 
      });
      return false;
    }
  },
  
  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(userData);
      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        isLoading: false 
      });
      return false;
    }
  },
  
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
    
    toast.success('Logged out successfully');
  },
  
  checkAuth: async () => {
    // Don't check if we don't have a token
    if (!localStorage.getItem('token')) {
      set({ user: null, token: null, isAuthenticated: false });
      return;
    }
    
    set({ isLoading: true });
    try {
      const data = await authApi.checkAuth();
      
      if (data && data.user) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
  
  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.updateUserProfile(userData);
      const updatedUser = response.data.user;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      set({ 
        user: updatedUser, 
        isLoading: false 
      });
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update profile', 
        isLoading: false 
      });
      return false;
    }
  }
}));
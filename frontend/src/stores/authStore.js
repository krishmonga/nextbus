import { create } from 'zustand';
import toast from 'react-hot-toast';
import { login as apiLogin } from '../api/auth';

export const useAuthStore = create((set, get) => {
  // Get stored values
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  
  // Parse user if it exists
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = storedToken || null;
  
  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
    
    clearErrors: () => set({ error: null }),
    
    register: async (userData) => {
      set({ isLoading: true, error: null });
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Registering user with data:', userData);
        
        // Create a user object from registration data
        const newUser = {
          id: Date.now(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone || '',
          preferredPayment: 'card',
          role: userData.role || 'user'
        };
        
        // For driver registrations, add driver info
        if (userData.role === 'driver' && userData.driverInfo) {
          newUser.driverInfo = userData.driverInfo;
        }
        
        // In a real app, we'd make an API call here
        const mockToken = 'mock-token-' + Date.now();
        
        // Store in localStorage temporarily - we won't auto-login on registration
        // This is just so we have the data for when they do login
        localStorage.setItem('registeredUser', JSON.stringify(newUser));
        
        set({ isLoading: false });
        toast.success('Registration successful! Please log in.');
        return true;
      } catch (error) {
        console.error('Registration error:', error);
        set({ 
          error: error.response?.data?.message || 'Registration failed. Please try again.', 
          isLoading: false 
        });
        return false;
      }
    },
    
    login: async (credentials) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiLogin(credentials);
        const { token, refreshToken, user } = response.data;
        
        // Save tokens and user to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        toast.success(`Welcome back, ${user.firstName}!`);
        return true;
      } catch (error) {
        console.error('Login error:', error);
        set({ 
          error: error.response?.data?.message || 'Invalid email or password', 
          isLoading: false 
        });
        return false;
      }
    },
    
    logout: () => {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      });
      
      toast.success('Logged out successfully');
    },
    
    checkAuth: async () => {
      // Don't set loading here to avoid flashing screens
      const token = localStorage.getItem('token');
      
      if (!token) {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false
        });
        return false;
      }
      
      try {
        // Get stored user
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          set({ 
            user,
            token,
            isAuthenticated: true
          });
          return true;
        }
        
        // If no stored user but token exists, clear token
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false
        });
        return false;
      } catch (error) {
        console.error('Auth check error:', error);
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false
        });
        return false;
      }
    },
    
    updateUser: (userData) => {
      try {
        // Get current user
        const currentUser = get().user || {};
        
        // Update user data
        const updatedUser = { 
          ...currentUser,
          ...userData
        };
        
        console.log('Updating user with data:', updatedUser);
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update state
        set({ user: updatedUser });
        return true;
      } catch (error) {
        console.error('Error updating user:', error);
        return false;
      }
    }
  };
});

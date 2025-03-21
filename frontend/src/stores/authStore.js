import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.nextbustracker.com/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      
      // Login user
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password })
          const { token, user } = response.data
          
          set({ 
            user, 
            token, 
            loading: false,
            error: null
          })
          
          toast.success('Logged in successfully!')
          return true
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
          set({ 
            loading: false, 
            error: errorMessage,
            user: null,
            token: null
          })
          
          toast.error(errorMessage)
          return false
        }
      },
      
      // Register user
      register: async (userData) => {
        set({ loading: true, error: null })
        try {
          const response = await axios.post(`${API_URL}/auth/register`, userData)
          
          toast.success('Registration successful! Please log in.')
          set({ loading: false })
          return true
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
          set({ 
            loading: false, 
            error: errorMessage 
          })
          
          toast.error(errorMessage)
          return false
        }
      },
      
      // Logout user
      logout: () => {
        set({ 
          user: null, 
          token: null,
          error: null
        })
        
        toast.success('Logged out successfully')
      },
      
      // Check if user is authenticated
      checkAuth: async () => {
        const { token } = get()
        
        if (!token) {
          set({ user: null })
          return false
        }
        
        try {
          // Verify token expiration
          const decoded = jwtDecode(token)
          const currentTime = Date.now() / 1000
          
          if (decoded.exp < currentTime) {
            // Token expired
            set({ 
              user: null, 
              token: null,
              error: 'Session expired. Please log in again.'
            })
            
            toast.error('Session expired. Please log in again.')
            return false
          }
          
          // Token still valid, verify with backend
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get(`${API_URL}/auth/me`)
          
          set({ 
            user: response.data,
            error: null
          })
          
          return true
        } catch (error) {
          // Invalid token or server error
          set({ 
            user: null, 
            token: null,
            error: 'Authentication failed. Please log in again.'
          })
          
          return false
        }
      },
      
      // Update user profile
      updateProfile: async (userData) => {
        set({ loading: true, error: null })
        
        try {
          const { token } = get()
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          const response = await axios.put(`${API_URL}/users/profile`, userData)
          
          set({ 
            user: response.data,
            loading: false,
            error: null
          })
          
          toast.success('Profile updated successfully!')
          return true
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.'
          set({ 
            loading: false, 
            error: errorMessage 
          })
          
          toast.error(errorMessage)
          return false
        }
      },
      
      // Reset password
      resetPassword: async (email) => {
        set({ loading: true, error: null })
        
        try {
          await axios.post(`${API_URL}/auth/reset-password`, { email })
          
          set({ loading: false })
          toast.success('Password reset instructions sent to your email')
          return true
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to send reset instructions. Please try again.'
          set({ 
            loading: false, 
            error: errorMessage 
          })
          
          toast.error(errorMessage)
          return false
        }
      },
      
      // Set axios auth header
      setAuthHeader: () => {
        const { token } = get()
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          delete axios.defaults.headers.common['Authorization']
        }
      },
      
      // Clear errors
      clearErrors: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }), // only persist these fields
    }
  )
)

// Set auth header on app initialization
const { setAuthHeader } = useAuthStore.getState()
setAuthHeader()
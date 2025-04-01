  import { create } from "zustand";
  import { persist } from "zustand/middleware";
  import axios from "axios";
  import { jwtDecode } from "jwt-decode";
  import toast from "react-hot-toast";

  const API_URL = import.meta.env.VITE_API_URL || "https://api.nextbustracker.com/api";

  export const useAuthStore = create(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        loading: false,
        error: null,

        // 🔹 Login User
        login: async (email, password) => {
          set({ loading: true, error: null });
          try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user } = response.data;

            // Store user & token
            set({ user, token, loading: false, error: null });
            localStorage.setItem("token", token);

            // Set auth header
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            toast.success("Logged in successfully!");
            return true;
          } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
            set({ loading: false, error: errorMessage, user: null, token: null });

            toast.error(errorMessage);
            return false;
          }
        },

        // 🔹 Register User
        register: async (userData) => {
          set({ loading: true, error: null });
          try {
            await axios.post(`${API_URL}/auth/register`, userData);
            toast.success("Registration successful! Please log in.");
            set({ loading: false });
            return true;
          } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            set({ loading: false, error: errorMessage });

            toast.error(errorMessage);
            return false;
          }
        },

        // 🔹 Logout User
        logout: () => {
          set({ user: null, token: null, error: null });
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];

          toast.success("Logged out successfully");
        },

        // 🔹 Check Authentication Status
        checkAuth: async () => {
          const token = localStorage.getItem("token");
          if (!token) {
            set({ user: null, token: null });
            return false;
          }

          try {
            // Decode token to check expiry
            const decoded = jwtDecode(token);
            if (decoded.exp < Date.now() / 1000) {
              set({ user: null, token: null, error: "Session expired. Please log in again." });
              localStorage.removeItem("token");
              toast.error("Session expired. Please log in again.");
              return false;
            }

            // Validate with backend
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get(`${API_URL}/auth/me`);
            set({ user: response.data, token, error: null });

            return true;
          } catch (error) {
            set({ user: null, token: null, error: "Authentication failed. Please log in again." });
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            return false;
          }
        },

        // 🔹 Update User Profile
        updateProfile: async (userData) => {
          set({ loading: true, error: null });
          try {
            const response = await axios.put(`${API_URL}/users/profile`, userData);
            set({ user: response.data, loading: false, error: null });

            toast.success("Profile updated successfully!");
            return true;
          } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
            set({ loading: false, error: errorMessage });

            toast.error(errorMessage);
            return false;
          }
        },

        // 🔹 Reset Password
        resetPassword: async (email) => {
          set({ loading: true, error: null });
          try {
            await axios.post(`${API_URL}/auth/reset-password`, { email });
            set({ loading: false });

            toast.success("Password reset instructions sent to your email.");
            return true;
          } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send reset instructions. Please try again.";
            set({ loading: false, error: errorMessage });

            toast.error(errorMessage);
            return false;
          }
        },

        // 🔹 Clear Errors
        clearErrors: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({ user: state.user, token: state.token }),
      }
    )
  );

  // 🔹 Set Auth Header on App Load
  const { token } = useAuthStore.getState();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

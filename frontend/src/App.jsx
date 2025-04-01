import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "./stores/authStore"; 
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage' 
import RegisterPage from './pages/RegisterPage'
import BusTrackingPage from './pages/BusTrackingPage'
import TaxiBookingPage from './pages/TaxiBookingPage'
import CarpoolPage from './pages/CarpoolPage'
import UserDashboardPage from './pages/UserDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import MapPage from './pages/MapPage';

function AppRoutes() {
  const { user } = useAuthStore();
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes - redirect if already logged in */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" state={{ from: location }} replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" state={{ from: location }} replace /> : <RegisterPage />} 
      />
      
      {/* Public Routes */}
      <Route path="/bus-tracking" element={<BusTrackingPage />} />
      <Route path="/taxi-booking" element={<TaxiBookingPage />} />
      <Route path="/carpool" element={<CarpoolPage />} />
      <Route path="/map" element={<MapPage />} />
      
      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboardPage />
        </ProtectedRoute>
      } />
      
      {/* Protected Admin Routes */}
      <Route path="/admin/*" element={
        <AdminRoute>
          <AdminDashboardPage />
        </AdminRoute>
      } />
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  const { checkAuth } = useAuthStore();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await checkAuth();
      } finally {
        setIsLoading(false);
      }
    };
    
    initApp();
  }, [checkAuth]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <AppRoutes />
    </Layout>
  );
}

export default App;
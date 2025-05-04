import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "./stores/authStore"; 
import { Toaster } from "react-hot-toast";
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage' 
import RegisterPage from './pages/RegisterPage'
import BusTrackingPage from './pages/BusTrackingPage'
import TaxiBookingPage from './pages/TaxiBookingPage'
import CarpoolPage from './pages/CarpoolPage'
import UserDashboardPage from './pages/UserDashboardPage'
// Import statement fixed - Make sure the path is correct
import DriverDashboardPage from './pages/DriverDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import MapPage from './pages/MapPage';
import DriverLocationSender from "./pages/DriverLocationSender";

// Create a driver route protection component
const DriverRoute = ({ children }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'driver') {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuthStore();
  const location = useLocation();

  // Get appropriate redirect path based on user role
  const getRedirectPath = () => {
    if (!user) return '/login';
    
    switch(user.role) {
      case 'admin':
        return '/admin';
      case 'driver':
        return '/driver/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes - redirect if already logged in */}
      <Route 
        path="/login" 
        element={
          user ? <Navigate to={getRedirectPath()} state={{ from: location }} replace /> : <LoginPage />
        } 
      />
      <Route 
        path="/register" 
        element={
          user ? <Navigate to={getRedirectPath()} state={{ from: location }} replace /> : <RegisterPage />
        } 
      />
      
      {/* Protected Routes - require authentication */}
      <Route path="/bus-tracking" element={
        <ProtectedRoute>
          <BusTrackingPage />
        </ProtectedRoute>
      } />
      <Route path="/taxi-booking" element={
        <ProtectedRoute>
          <TaxiBookingPage />
        </ProtectedRoute>
      } />
      <Route path="/carpool" element={
        <ProtectedRoute>
          <CarpoolPage />
        </ProtectedRoute>
      } />
      
      {/* Public Routes */}
      <Route path="/map" element={<MapPage />} />
      
      {/* Protected User Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <UserDashboardPage />
        </ProtectedRoute>
      } />
      
      {/* Driver Routes */}
      <Route path="/driver/dashboard" element={
        <DriverRoute>
          <DriverDashboardPage />
        </DriverRoute>
      } />
      <Route path="/driver/location" element={
        <DriverRoute>
          <DriverLocationSender />
        </DriverRoute>
      } />
      {/* Legacy route - redirect to new structure */}
      <Route path="/driver" element={<Navigate to="/driver/dashboard" replace />} />
      
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
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: darkMode ? '#1F2937' : '#FFFFFF',
            color: darkMode ? '#F9FAFB' : '#111827',
          },
        }}
      />
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <AppRoutes />
      </Layout>
    </>
  );
}

export default App; 
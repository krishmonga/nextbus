import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const { user, setRedirectPath } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // Store the current path before redirecting to login
    setRedirectPath(location.pathname + location.search);
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
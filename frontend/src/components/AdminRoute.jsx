import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

export default AdminRoute
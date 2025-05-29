
import { Navigate, Outlet } from 'react-router-dom';
import Auth from '../utils/auth';

const ProtectedRoute = () => {
  // Check if user is authenticated
  if (!Auth.loggedIn()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
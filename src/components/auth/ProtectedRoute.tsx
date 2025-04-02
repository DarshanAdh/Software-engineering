import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ensure user is a helper for helper routes
  if (user?.userType !== 'helper' && location.pathname === '/helper-dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  // Ensure user is a customer for customer routes
  if (user?.userType !== 'customer' && location.pathname === '/dashboard') {
    return <Navigate to="/helper-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedHelperRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.userType !== 'helper') {
    return <Navigate to="/" replace />;
  }

  // Redirect to pending approval page if helper is not approved
  if (!user.isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  return <Outlet />;
};

export default ProtectedHelperRoute;

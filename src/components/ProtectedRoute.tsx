import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { selectIsTempPassword } from '../redux/slices/userSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const isTempPassword = useSelector(selectIsTempPassword);
  const location = useLocation();


  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  else if (isTempPassword && location.pathname !== "/changePassword") {
    return <Navigate to="/changePassword" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

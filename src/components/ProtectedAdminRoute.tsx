import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Navigate } from 'react-router-dom';
import { selectRole } from '../redux/slices/userSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const role = useSelector(selectRole);


  if (isAuthenticated === undefined || role === undefined) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || role !== "admin") {
    setTimeout(() => {
      return <Navigate to="/" replace />;
    }, 500);
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;

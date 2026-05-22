import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuthContext();
  return user?.role === 'Admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
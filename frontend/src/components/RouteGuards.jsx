import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirect to login if no session
export function RequireAuth({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// Redirect to dashboard if already logged in
export function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'doctor' ? '/doctor' : '/dashboard'} replace />;
  return children;
}

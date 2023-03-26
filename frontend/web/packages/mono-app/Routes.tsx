import { useAuth } from 'packages/auth/AuthContext';
import Redirect from 'packages/http/Redirect';
import { Outlet } from 'react-router';

export const ProtectedRoute = (): JSX.Element | null => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Redirect to="/login" />;
};

export const UnprotectedRoute = (): JSX.Element | null => {
  const { token } = useAuth();

  return token ? <Redirect to="/dashboard" /> : <Outlet />;
};

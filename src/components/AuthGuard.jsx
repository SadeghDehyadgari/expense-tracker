import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * AuthGuard - Controls access based on authentication status
 * @param {Object} props
 * @param {boolean} props.requireAuth - If true, only authenticated users can access; if false, only unauthenticated users can access
 * @param {string} props.fallbackPath - Path to redirect to when condition fails
 * @param {React.ReactNode} props.children - Content to render if condition passes
 */
const AuthGuard = ({ requireAuth = true, fallbackPath, children }) => {
  const { isAuthenticated } = useAuth();

  const shouldRedirect = (requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated);

  if (shouldRedirect) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default AuthGuard;

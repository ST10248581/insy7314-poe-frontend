import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ isLoggedIn, redirectTo = '/login', children }) {
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

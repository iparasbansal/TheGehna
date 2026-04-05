import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
  // If the user isn't an admin, kick them back to the Home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
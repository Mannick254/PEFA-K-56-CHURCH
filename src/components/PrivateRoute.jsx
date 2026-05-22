import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

const PrivateRoute = ({ children, isAdminRoute }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdminRoute && !user.user_metadata?.is_admin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;

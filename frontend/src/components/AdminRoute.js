import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = () => {
  const { isAuthenticated, isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated and has admin role
  return isAuthenticated && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAppContext();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If adminOnly is true, check if user has admin role
  // For now, we'll assume all authenticated users can access admin
  // In a real app, you'd check user roles/permissions
  if (adminOnly && user && !user.email.includes('admin')) {
    // You could add a role check here
    // For now, just allow access
  }

  return <>{children}</>;
};

export default ProtectedRoute;
import React, { Component } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
interface ProtectedRouteProps {
  children: React.ReactNode;
}
export const ProtectedRoute = ({
  children
}: ProtectedRouteProps) => {
  const {
    user,
    isLoading
  } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>;
  }
  if (!user) {
    // Encode the current path and search params as the 'next' parameter
    const nextParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?next=${nextParam}`} replace />;
  }
  return <>{children}</>;
};
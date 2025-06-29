import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { User } from '../types/shared'; // Add the User type import
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdminRoute?: boolean;
  isDietitianRoute?: boolean;
}
export const ProtectedRoute = ({
  children,
  isAdminRoute = false,
  isDietitianRoute = false
}: ProtectedRouteProps) => {
  const {
    user,
    isAuthenticated,
    isLoading
  } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // For admin routes, check if the user is an admin
  if (isAdminRoute && user?.role !== 'admin') {
    // Redirect non-admins to the homepage
    return <Navigate to="/" replace />;
  }

  // For dietitian routes, check if the user is a dietitian
  if (isDietitianRoute && user?.role !== 'dietitian') {
    // Redirect non-dietitians to the homepage
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and has the required role if specified)
  return <>{children}</>;
};

// Update your AuthContextType in context/AuthContext.tsx
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // ...other properties
}
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/shared';
import { fetchData } from '../services/api';
import { setAuthToken, getCurrentUser, setCurrentUser, clearAuth } from '../services/auth';

// Helper function to determine redirect route based on user role
export const getRedirectRoute = (user: User | null, fallback: string = '/'): string => {
  if (!user) return fallback;
  
  switch (user.role) {
    case 'admin':
      return '/admin'; // This will show AdminDashboard as it's the index route
    case 'dietitian':
      return '/dietitian'; // This will show DietitianMessaging as it's the index route
    case 'user':
    default:
      return fallback;
  }
};

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUserAddress: (newAddress: Address) => void;
  updateUserProfile: (profileData: { firstName: string; lastName: string }) => void;
  setupAdminAccount: (adminKey: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = getCurrentUser();
      
      if (token && storedUser) {
        try {
          // Verify token with backend
          await fetchData<{ user: any }>('/auth/verify');
          setUser(storedUser);
        } catch (error) {
          console.error('Token verification failed:', error);
          clearAuth();
          setUser(null);
          const protectedRoutes = ['/cart', '/checkout', '/payment', '/account'];
          if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
            navigate('/auth');
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchData<{
        message: string;
        user: {
          id: number;
          email: string;
          firstName: string;
          lastName: string;
          role: string;
          address?: Address;
          phone?: string;
        };
        token: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log('Login response:', response);

      // Ensure we have all required user data
      const userData: User = {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
        address: response.user.address,
        phone: response.user.phone,
        createdAt: new Date().toISOString(),
      };

      setAuthToken(response.token);
      setCurrentUser(userData);
      setUser(userData);

      // Navigate based on role
      const redirectRoute = getRedirectRoute(userData, '/');
      console.log('Redirecting to:', redirectRoute);
      navigate(redirectRoute);
    } catch (error: any) {
      console.error('Login error:', error);
      // Preserve the error structure from the API
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      const response = await fetchData<{
        message: string;
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          role: string;
          phone?: string;
          address?: string;
        };
        token: string;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          address: userData.address,
        }),
      });

      console.log('Register response:', response);

      // Ensure we have all required user data
      const newUser: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        role: response.user.role,
        phone: response.user.phone,
        address: typeof response.user.address === 'string' 
          ? undefined 
          : response.user.address as Address,
        createdAt: new Date().toISOString(),
      };

      setAuthToken(response.token);
      setCurrentUser(newUser);
      setUser(newUser);

      // Navigate based on role
      const redirectRoute = getRedirectRoute(newUser, '/');
      navigate(redirectRoute);
    } catch (error: any) {
      console.error('Registration error:', error);
      // Preserve the error structure from the API
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    navigate('/');
  };

  const updateUserAddress = (newAddress: Address) => {
    if (user) {
      const updatedUser = { ...user, address: newAddress };
      setUser(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  const updateUserProfile = (profileData: { firstName: string; lastName: string }) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  const setupAdminAccount = async (adminKey: string): Promise<boolean> => {
    try {
      const response = await fetchData<{ message: string }>('/auth/setup-admin', {
        method: 'POST',
        body: JSON.stringify({ adminKey }),
      });
      console.log('Admin setup response:', response);
      return true;
    } catch (error: any) {
      console.error('Admin setup error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserAddress,
        updateUserProfile,
        setupAdminAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/shared';
import { fetchData } from '../services/api';
import { AUTH_TOKEN_KEY, USER_KEY, setAuthToken, removeAuthToken, getCurrentUser, setCurrentUser, clearAuth } from '../services/auth';
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
  const navigate = useNavigate();  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = getCurrentUser();
      
      if (token && storedUser) {
        try {
          // Verify token with backend
          const response = await fetchData<{ user: any }>('/auth/verify');
          setUser(storedUser);
        } catch (error) {
          console.error('Token verification failed:', error);
          clearAuth();
          setUser(null);          const protectedRoutes = ['/cart', '/checkout', '/payment', '/account'];
          if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
            navigate('/auth');
          }
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  const updateUserAddress = (newAddress: Address) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      address: newAddress
    };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };  const register = async (userData: {
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
          phone: string;
          address: string;
        };
        token: string;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Store token and user data
      setAuthToken(response.token);
      
      const newUser: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        address: response.user.address ? {
          street: response.user.address,
          city: '',
          state: '',
          zip: '',
          country: ''
        } : undefined
      };
      
      setCurrentUser(newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. Please try again.');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetchData<{
        message: string;
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          phone: string;
          address: string;
        };
        token: string;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // Store token and user data
      setAuthToken(response.token);
      
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        address: response.user.address ? {
          street: response.user.address,
          city: '',
          state: '',
          zip: '',
          country: ''
        } : undefined
      };
      
      setCurrentUser(userData);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  };  const logout = () => {
    clearAuth();
    setUser(null);
    navigate('/auth');
  };
  // Make sure isAuthenticated is calculated based on user existence
  const isAuthenticated = !!user;

  // Add the new admin setup function
  const setupAdminAccount = async (adminKey: string): Promise<boolean> => {
    try {
      // Normalize the input by trimming whitespace
      const normalizedKey = adminKey.trim();
      // Use exact string comparison with the expected key
      const expectedKey = 'bumba-admin-2025';
      
      console.log('Key validation:', normalizedKey === expectedKey);
      
      if (normalizedKey !== expectedKey) {
        return false;
      }
      
      if (!user) {
        console.log('No user logged in');
        return false;
      }
      
      // Create updated user with admin privileges
      const adminUser = {
        ...user,
        isAdmin: true
      };
        // Update in localStorage
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      
      // Update state
      setUser(adminUser);
      
      return true;
    } catch (error) {
      console.error('Admin setup error:', error);
      return false;
    }
  };
    // Include the function in your context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUserAddress,
    setupAdminAccount,
  };

  return <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
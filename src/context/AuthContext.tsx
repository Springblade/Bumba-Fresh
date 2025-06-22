import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/shared'; // Make sure User is imported
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean; // Make sure this is defined
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserAddress: (newAddress: Address) => void;

  // New admin-specific method
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
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    if (authToken && currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        // Verify the user exists in fakeUsers
        const fakeUsers = JSON.parse(localStorage.getItem('fakeUsers') || '[]');
        const isValidUser = fakeUsers.some((u: any) => u.email === userData.email);
        if (!isValidUser) {
          throw new Error('Invalid user');
        }
        setUser(userData);
      } catch (e) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        setUser(null);
        const protectedRoutes = ['/cart', '/checkout', '/payment'];
        if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
          navigate('/auth');
        }
      }
    }
    setIsLoading(false);
  }, [navigate]);
  const updateUserAddress = (newAddress: Address) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      address: newAddress
    };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };
  const login = async (email: string, password: string) => {
    const fakeUsers = JSON.parse(localStorage.getItem('fakeUsers') || '[]');
    const foundUser = fakeUsers.find((u: any) => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    // Get stored address if it exists
    const currentUser = localStorage.getItem('currentUser');
    const existingAddress = currentUser ? JSON.parse(currentUser).address : undefined;
    const userData = {
      id: foundUser.id || Math.random().toString(36).substr(2, 9),
      email: foundUser.email,
      firstName: foundUser.fullName.split(' ')[0],
      lastName: foundUser.fullName.split(' ')[1] || '',
      address: existingAddress
    };
    localStorage.setItem('authToken', Math.random().toString(36).substr(2));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
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
      
      // Also update in fakeUsers array if it exists
      try {
        const storedUsers = localStorage.getItem('fakeUsers');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((u: any) => 
            u.email === user.email ? { ...u, isAdmin: true } : u
          );
          localStorage.setItem('fakeUsers', JSON.stringify(updatedUsers));
        }
      } catch (err) {
        // Non-critical error, continue
        console.log('Could not update users array');
      }
      
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
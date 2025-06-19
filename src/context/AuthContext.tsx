import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: Address;
};
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserAddress: (newAddress: Address) => void;
};
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
  return <AuthContext.Provider value={{
    user,
    login,
    logout,
    isLoading,
    updateUserAddress
  }}>
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
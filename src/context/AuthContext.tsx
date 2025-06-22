import React, { useEffect, useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, verifyToken, logoutUser, RegisterData } from '../services/api';
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
  role: string;
};
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserAddress: (newAddress: Address) => void;
  updateUserProfile: (profileData: { firstName: string; lastName: string }) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: Checking authentication on app load...');
      const token = localStorage.getItem('authToken');
      console.log('AuthContext: Found token:', !!token);
      
      if (token) {
        try {
          console.log('AuthContext: Verifying token...');
          const response = await verifyToken();          console.log('AuthContext: Token verification response:', response);
          
          const userData = {
            id: response.user.id.toString(),
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            // Parse address if it exists and is a string, otherwise keep as Address object
            address: typeof response.user.address === 'string' ? undefined : response.user.address,
            role: response.user.role
          };
          setUser(userData);
          console.log('AuthContext: User set from token verification:', userData);
        } catch (error) {
          console.error('AuthContext: Token verification failed:', error);
          // Clear invalid tokens
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
          setUser(null);
          
          // Only redirect if on a protected route and not already on auth page
          const protectedRoutes = ['/cart', '/checkout', '/payment', '/account'];
          const currentPath = window.location.pathname;
          if (protectedRoutes.some(route => currentPath.startsWith(route)) && currentPath !== '/auth') {
            console.log('AuthContext: Redirecting to /auth from protected route:', currentPath);
            navigate('/auth');
          }
        }
      } else {
        // Check if there's cached user data when there's no token
        const cachedUser = localStorage.getItem('currentUser');
        if (cachedUser) {
          // Clear stale cached data
          console.log('AuthContext: Clearing stale cached user data');
          localStorage.removeItem('currentUser');
        }
      }
      console.log('AuthContext: Setting isLoading to false');
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
  };  
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await loginUser({ email, password });
      console.log('Login response:', response);
        const userData = {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        // Parse address if it exists and is a string, otherwise keep as Address object
        address: typeof response.user.address === 'string' ? undefined : response.user.address,
        role: response.user.role
      };

      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      
      console.log('Login successful, user set:', userData);
      console.log('Current pathname after login:', window.location.pathname);
    } catch (error) {
      console.error('Login failed:', error);
      // Clear any existing auth data on login failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setUser(null);
      throw error;
    }
  };  const register = async (userData: RegisterData) => {
    try {
      console.log('Attempting registration with:', { email: userData.email, firstName: userData.firstName, lastName: userData.lastName });
      const response = await registerUser(userData);
      console.log('Registration response:', response);
      
      const userInfo = {
        id: response.user.id.toString(),
        email: response.user.email,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        // Parse address if it exists and is a string, otherwise keep as Address object
        address: typeof response.user.address === 'string' ? undefined : response.user.address,
        role: response.user.role // TODO: ROLE-BASED REDIRECTION - Role is available here for registration
      };

      // Store token and user data
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('currentUser', JSON.stringify(userInfo));
      setUser(userInfo);
      
      console.log('Registration successful, user set:', userInfo);
      
      // TODO: ROLE-BASED REDIRECTION IMPLEMENTATION NEEDED HERE
      // Requirements from Authorization.md:
      // - When one registers from the website, it is automatically a 'user' account
      // - Users should be redirected to the main website (/) after registration
      // 
      // Note: New registrations will always have role === 'user' as per backend logic
      // The registration redirection logic should be implemented in the signup form components
      
    } catch (error) {
      console.error('Registration failed:', error);
      // Clear any existing auth data on registration failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setUser(null);
      navigate('/auth');
    }
  };

  const updateUserProfile = (profileData: { firstName: string; lastName: string }) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      firstName: profileData.firstName,
      lastName: profileData.lastName
    };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return <AuthContext.Provider value={{
    user,
    login,
    register,
    logout,
    isLoading,
    updateUserAddress,
    updateUserProfile
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
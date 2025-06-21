import React, { useState } from 'react';
import { FormField } from './ui/FormField';
import { PasswordInput } from './ui/PasswordInput';
import { Button } from './ui/Button';
import { AtSignIcon } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginForm = () => {  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      await login(email, password);
      
      // Role-based redirection logic
      // Get user data from localStorage which is set immediately in login function
      setTimeout(() => {
        const storedUser = localStorage.getItem('currentUser');
        let loggedInUser = null;
        
        if (storedUser) {
          try {
            loggedInUser = JSON.parse(storedUser);
          } catch (e) {
            console.error('Error parsing stored user data:', e);
          }
        }
        
        // Fallback to context user if localStorage parsing fails
        if (!loggedInUser) {
          loggedInUser = user;
        }
        
        if (loggedInUser?.role) {
          console.log('LoginForm: User role detected:', loggedInUser.role);
          
          // Role-based redirection as per Authorization.md requirements
          switch (loggedInUser.role) {
            case 'admin':
              console.log('LoginForm: Redirecting admin to /admin');
              navigate('/admin');
              break;
            case 'dietitian':
              console.log('LoginForm: Redirecting dietitian to /dietitian');
              navigate('/dietitian');
              break;
            case 'user':
            default:
              // Handle redirect parameter for users or default to home
              const urlParams = new URLSearchParams(window.location.search);
              const redirectTo = urlParams.get('redirect') || '/';
              console.log('LoginForm: Redirecting user to:', redirectTo);
              navigate(redirectTo);
              break;
          }
        } else {
          // Fallback if role is not available
          console.log('LoginForm: No role detected, redirecting to home');
          navigate('/');
        }
      }, 100); // Reduced timeout since we're using localStorage
      
      console.log('LoginForm: Login completed, role-based navigation scheduled...');
    } catch (error: any) {
      console.error('Login error:', error);
      setErrors({
        email: error.message || 'Login failed. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-6">
        <FormField 
          name="email"
          label="Email" 
          type="email" 
          placeholder="Email address" 
          icon={<AtSignIcon />} 
          required 
          error={errors.email} 
        />
        <PasswordInput 
          name="password"
          label="Password" 
          placeholder="Password" 
          required 
          error={errors.password} 
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center group cursor-pointer select-none">
          <input type="checkbox" className="rounded-md border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 h-4 w-4 transition-all duration-200 checked:border-primary-500 hover:border-primary-400" aria-label="Remember me" />
          <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
            Remember me
          </span>
        </label>
        <a href="#" className="text-sm text-primary-600 hover:text-primary-700 transition-all duration-200 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded">
          Forgot password?
        </a>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <>
            <LoadingSpinner className="mr-2" />
            Signing in...
          </> : 'Sign in'}
      </Button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button type="button" className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm group">
          <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-gray-700 font-medium">Google</span>
        </button>
        <button type="button" className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm group">
          <img src="https://www.apple.com/favicon.ico" alt="" className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-gray-700 font-medium">Apple</span>        </button>
      </div>
    </form>
  );
};
import React, { useState } from 'react';
import { FormField } from './ui/FormField';
import { PasswordInput } from './ui/PasswordInput';
import { Button } from './ui/Button';
import { UserIcon, AtSignIcon } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      const formData = new FormData(e.currentTarget);
      const userData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      };

      await register(userData);
      
      // Add a small delay to ensure the auth state is properly set
      setTimeout(() => {
        console.log('SignupForm: Navigating to home...');
        navigate('/');
      }, 200);
    } catch (error) {
      setErrors({
        email: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="flex gap-x-4">
          <FormField 
            name="firstName"
            label="First name" 
            type="text" 
            placeholder="First name" 
            icon={<UserIcon />} 
            required 
            error={errors.firstName} 
            className="w-full" 
          />
          <FormField 
            name="lastName"
            label="Last name" 
            type="text" 
            placeholder="Last name" 
            icon={<UserIcon />} 
            required 
            error={errors.lastName} 
            className="w-full" 
          />
        </div>
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
          showStrengthMeter 
        />
      </div>
      <div className="flex items-start group cursor-pointer select-none">
        <div className="flex items-center h-5">
          <input 
            id="terms" 
            type="checkbox" 
            className="rounded-md border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 h-4 w-4 transition-all duration-200 checked:border-primary-500 hover:border-primary-400" 
            required 
          />
        </div>
        <div className="ml-3">
          <label htmlFor="terms" className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
            I agree to the{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-all duration-200 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 transition-all duration-200 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <LoadingSpinner className="mr-2" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Sign up with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button" 
          className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm group"
        >
          <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-gray-700 font-medium">Google</span>
        </button>
        <button 
          type="button" 
          className="flex items-center justify-center gap-3 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:border-gray-300 hover:shadow-sm group"
        >
          <img src="https://www.apple.com/favicon.ico" alt="" className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="text-gray-700 font-medium">Apple</span>
        </button>
      </div>
    </form>
  );
};

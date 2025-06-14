import React, { useEffect, useState } from 'react';
import { FormField } from './ui/FormField';
import { PasswordInput } from './ui/PasswordInput';
import { Button } from './ui/Button';
import { AtSignIcon } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    login,
    user,
    isLoading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isRegistered = searchParams.get('registered') === '1';
  const next = searchParams.get('next') || '/';
  useEffect(() => {
    if (!authLoading && user) {
      navigate(next);
    }
  }, [user, authLoading, navigate, next]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      await login(email, password);
    } catch (error) {
      setErrors({
        email: 'Invalid email or password'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto">
      {isRegistered && <div className="p-4 rounded-lg bg-success-50 border border-success-200 text-success-700">
          Registration successful. Please log in.
        </div>}
      <div className="space-y-6">
        <FormField name="email" label="Email" type="email" placeholder="Email address" icon={<AtSignIcon />} required error={errors.email} />
        <PasswordInput name="password" label="Password" placeholder="Password" required error={errors.password} />
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
          <span className="text-gray-700 font-medium">Apple</span>
        </button>
      </div>
    </form>;
};
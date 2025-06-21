import { useState, useEffect } from 'react';
import { SignupForm } from '../components/SignupForm';
import { LoginForm } from '../components/LoginForm';
import { SparklesIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();  // Redirect if already logged in (disabled to avoid conflicts with LoginForm navigation)
  useEffect(() => {
    console.log('AuthPage useEffect triggered:', { 
      user: user?.email, 
      isLoading, 
      pathname: window.location.pathname 
    });
    
    // Temporarily disable auto-redirect to troubleshoot the navigation issue
    // The LoginForm will handle navigation after successful login
    
    /*
    if (!isLoading && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect') || '/';
      console.log('AuthPage redirecting to:', redirectTo);
      
      // Add a small delay to ensure login process is complete
      setTimeout(() => {
        navigate(redirectTo);
      }, 100);
    }
    */
  }, [user, isLoading, navigate]);
  return <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 relative">
      {/* Keep only the dot pattern as a unique overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:32px_32px] pointer-events-none opacity-70" />
      <div className="container max-w-[1280px] mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-xl shadow-primary-600/5 overflow-hidden border border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-600/10">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-700 p-8 md:p-12 text-white flex flex-col justify-center motion-safe:animate-fade-in relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[size:250px_250px]" />
              <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" />
              <div className="max-w-md mx-auto relative">
                <SparklesIcon className="h-12 w-12 mb-8 text-white/90 animate-float" />
                <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight leading-tight whitespace-pre-line">
                  {isLogin ? 'Welcome\nBack!' : 'Join Our\nCommunity'}
                </h1>
                <p className="text-lg mb-8 text-white/90 leading-relaxed">
                  {isLogin ? 'Sign in to access your account and continue your journey with us.' : 'Create an account to get started and unlock all our features.'}
                </p>
                <div className="hidden md:block">
                  <button onClick={() => setIsLogin(!isLogin)} className="inline-flex items-center text-white bg-white/10 border border-white/20 px-5 py-2.5 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm transform hover:scale-105 active:scale-95 group">
                    {isLogin ? <>
                        Create an account
                        <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </> : <>
                        <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to login
                      </>}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
                  </h1>
                  <p className="text-gray-600">
                    {isLogin ? 'Enter your credentials to access your account' : 'Fill in your information to get started'}
                  </p>
                </div>
                {isLogin ? <LoginForm /> : <SignupForm />}
                <div className="mt-8 text-center md:hidden">
                  <button onClick={() => setIsLogin(!isLogin)} className="text-primary-600 hover:text-primary-700 transition-colors duration-300 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/30 rounded">
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>;
};
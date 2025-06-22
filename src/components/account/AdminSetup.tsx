import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield } from 'lucide-react';

/* 
 * CHANGE: Created admin setup component for activating admin access
 * DATE: 22-06-2025
 */
const AdminSetup: React.FC = () => {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, setupAdminAccount } = useAuth();
  const navigate = useNavigate();
  
  // If user is already admin, redirect to admin dashboard
  React.useEffect(() => {
    if (user?.isAdmin) {
      navigate('/admin');
    }
  }, [user, navigate]);
  
  /* 
   * CHANGE: Improved admin key validation and error handling in form
   * DATE: 22-06-2025
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('Attempting admin setup with key length:', adminKey.length);
    
    try {
      // Ensure we have a key
      if (!adminKey || adminKey.trim() === '') {
        setError('Please enter an admin key');
        setIsLoading(false);
        return;
      }
      
      // Call setupAdminAccount with the trimmed key
      const success = await setupAdminAccount(adminKey);
      
      console.log('Admin setup result:', success);
      
      if (success) {
        // Redirect to admin dashboard on success
        navigate('/admin');
      } else {
        setError('Invalid admin key. Please try again.');
      }
    } catch (err) {
      console.error('Error during admin setup:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-lg mx-auto">
      <div className="flex justify-center mb-6">
        <div className="p-3 rounded-full bg-primary-100">
          <Shield className="h-8 w-8 text-primary-600" />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Access Setup</h1>
      <p className="text-gray-600 text-center mb-8">
        Enter your admin key to activate admin privileges.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1">
            Admin Key
          </label>
          <input
            id="adminKey"
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter your admin key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            required
          />
        </div>
        
        {error && <p className="text-error-600 text-sm">{error}</p>}
        
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              Processing...
            </span>
          ) : (
            'Activate Admin Access'
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminSetup;
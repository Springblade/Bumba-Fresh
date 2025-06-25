import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ApiStatusProps {
  onRetry?: () => void;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ onRetry }) => {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [apiUrl, setApiUrl] = useState<string>('');

  const checkApiStatus = async () => {
    setStatus('checking');
    setErrorMessage('');
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    setApiUrl(baseUrl);
    
    try {
      console.log(' Checking API status at:', baseUrl);
      
      // Try to reach the API health endpoint
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setStatus('success');
        console.log(' API is reachable');
      } else {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(' API check failed:', error);
      setStatus('error');
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          setErrorMessage('Backend server is not running or unreachable');
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Unknown error occurred');
      }
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  const handleRetry = () => {
    checkApiStatus();
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">API Connection Status</h3>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Check Again
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">API URL:</span>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{apiUrl}</code>
        </div>
        
        <div className="flex items-center gap-2">
          {status === 'checking' && (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
              <span className="text-sm text-yellow-700">Checking connection...</span>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-700">Backend is connected and running</span>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">
                Backend connection failed: {errorMessage}
              </span>
            </>
          )}
        </div>
        
        {status === 'error' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-semibold text-red-800 mb-2">Troubleshooting Steps:</h4>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              <li>Ensure the backend server is running: <code>cd backend && npm start</code></li>
              <li>Check if the server is accessible at: <a href={apiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{apiUrl}</a></li>
              <li>Verify database connection is working</li>
              <li>Check for CORS configuration issues</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiStatus;

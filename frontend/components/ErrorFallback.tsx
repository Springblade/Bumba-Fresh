import React from 'react';
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from './ui/Button';
interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}
export const ErrorFallback = ({
  title = 'Something went wrong',
  message = "We're sorry, but something unexpected happened. Please try again.",
  onRetry
}: ErrorFallbackProps) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  return <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 text-error-600 mb-4">
          <AlertCircleIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6 max-w-md">{message}</p>
        <Button onClick={handleRetry}>
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>;
};
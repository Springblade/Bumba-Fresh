import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}
export const ErrorState = ({
  message = 'Something went wrong. Please try again.',
  onRetry
}: ErrorStateProps) => {
  return <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-error-50 text-error-600 p-4 rounded-full mb-4">
        <AlertCircleIcon className="w-8 h-8" />
      </div>
      <p className="text-gray-900 font-medium mb-2">{message}</p>
      {onRetry && <Button onClick={onRetry} variant="outline" className="mt-4">
          Try Again
        </Button>}
    </div>;
};
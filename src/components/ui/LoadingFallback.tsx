import React from 'react';
import { Loader2Icon } from 'lucide-react';
interface LoadingFallbackProps {
  message?: string;
  variant?: 'default' | 'overlay' | 'inline';
}
export const LoadingFallback = ({
  message = 'Loading...',
  variant = 'default'
}: LoadingFallbackProps) => {
  if (variant === 'overlay') {
    return <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>;
  }
  if (variant === 'inline') {
    return <div className="flex items-center gap-2 text-gray-600">
        <Loader2Icon className="w-4 h-4 animate-spin" />
        <span className="text-sm">{message}</span>
      </div>;
  }
  return <div className="min-h-[200px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2Icon className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>;
};
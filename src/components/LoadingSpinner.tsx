import React from 'react';
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  return <div className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary-600 ${sizeClasses[size]} ${className}`} role="status" aria-label="loading">
      <span className="sr-only">Loading...</span>
    </div>;
};
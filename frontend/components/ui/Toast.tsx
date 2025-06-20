import React, { useEffect, useState } from 'react';
import { XIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon, AlertTriangleIcon } from 'lucide-react';
export type ToastProps = {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
};
const toastIcons = {
  success: CheckCircleIcon,
  error: AlertCircleIcon,
  info: InfoIcon,
  warning: AlertTriangleIcon
};
const toastStyles = {
  success: 'bg-success-50 border-success-500 text-success-900',
  error: 'bg-error-50 border-error-500 text-error-900',
  info: 'bg-info-50 border-info-500 text-info-900',
  warning: 'bg-warning-50 border-warning-500 text-warning-900'
};
const iconStyles = {
  success: 'text-success-500',
  error: 'text-error-500',
  info: 'text-info-500',
  warning: 'text-warning-500'
};
export const Toast = ({
  id,
  title,
  description,
  type = 'info',
  duration = 5000,
  onClose
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = toastIcons[type];
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Allow time for exit animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, id, onClose]);
  return <div className={`
        ${isVisible ? 'animate-enter' : 'animate-leave'}
        max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto border-l-4
        ${toastStyles[type]}
      `} role="alert" aria-live="polite">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${iconStyles[type]}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button className="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500" onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}>
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export const ToastContainer = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        {children}
      </div>
    </div>;
};
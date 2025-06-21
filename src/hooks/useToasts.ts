import { useToastContext } from '../context/ToastContext';
import { ToastType } from '../context/ToastContext';

export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

export const useToasts = () => {
  const context = useToastContext();
  
  if (!context) {
    throw new Error("useToasts must be used within a ToastProvider");
  }
  
  return {
    toast: context.addToast
  };
};

// Add this export to make both naming conventions work
export const useToast = useToasts;
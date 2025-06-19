import React, { useCallback, useState, createContext, useContext } from 'react';
import { Toast, ToastContainer } from '../components/ui/Toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string; // Remove the optional modifier
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const ToastProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(currentToasts => [...currentToasts, {
      ...toast,
      id
    }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }, []);

  return <ToastContext.Provider value={{
    addToast,
    removeToast
  }}>
      {children}
      <ToastContainer>
        {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />)}
      </ToastContainer>
    </ToastContext.Provider>;
};
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
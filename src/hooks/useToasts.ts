import { useToastContext } from '../context/ToastContext';
import type { ToastProps } from '../context/ToastContext';
export const useToasts = () => {
  const {
    addToast
  } = useToastContext();
  return {
    addToast: (toast: Omit<ToastProps, 'id'>) => addToast(toast)
  };
};
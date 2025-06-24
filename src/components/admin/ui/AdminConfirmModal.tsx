import React from 'react';
import { X } from 'lucide-react';

/* 
 * CHANGE: Created reusable admin confirmation modal
 * DATE: 21-06-2025
 */
interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      button: 'bg-error-600 hover:bg-error-700 focus:ring-error-500/20',
      icon: 'bg-error-100 text-error-600',
    },
    warning: {
      button: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500/20',
      icon: 'bg-warning-100 text-warning-600',
    },
    info: {
      button: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500/20',
      icon: 'bg-primary-100 text-primary-600',
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700">{message}</p>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded-md text-sm font-medium ${typeStyles[type].button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmModal;
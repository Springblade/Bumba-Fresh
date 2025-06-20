import React, { useState, Fragment } from 'react';
import { XIcon } from 'lucide-react';
import { Button } from './Button';
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}
export const Dialog = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer
}: DialogProps) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose} />
        {/* Dialog */}
        <div className="relative w-full max-w-lg transform rounded-xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 id="dialog-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500" aria-label="Close dialog">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          {/* Content */}
          <div className="px-6 py-4">{children}</div>
          {/* Footer */}
          {footer && <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 rounded-b-xl">
              {footer}
            </div>}
        </div>
      </div>
    </div>;
};
// Example usage:
export const DialogExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Dialog Title" description="This is a description of the dialog." footer={<>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>Confirm</Button>
        </>}>
      <p>Dialog content goes here.</p>
    </Dialog>;
};
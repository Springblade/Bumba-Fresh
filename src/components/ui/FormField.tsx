import React, { forwardRef } from 'react';
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  required?: boolean;
}
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  error,
  icon,
  helperText,
  className = '',
  required,
  id,
  ...props
}, ref) => {
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  return <div className={className}>
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>}          <input 
            ref={ref} 
            id={inputId} 
            aria-describedby={`${helperText ? helperTextId : ''} ${error ? errorId : ''}`} 
            className={`
              w-full rounded-lg border ${error ? 'border-error-300' : 'border-gray-300'}
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
              text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500
              transition-colors duration-200
            `} 
            {...props} 
          />
        </div>
        {helperText && !error && <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>}
        {error && <p id={errorId} className="mt-1 text-sm text-error-600">
            {error}
          </p>}
      </div>;
});
FormField.displayName = 'FormField';
import React, { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  rightIcon,
  onRightIconClick,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  return <div className={className}>
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>}
          <input ref={ref} id={inputId} aria-describedby={`${helperText ? helperTextId : ''} ${error ? errorId : ''}`} className={`
              w-full rounded-lg border ${error ? 'border-error-300' : 'border-gray-300'}
              ${icon ? 'pl-10' : 'pl-4'} 
              ${rightIcon ? 'pr-10' : 'pr-4'} 
              py-2.5
              text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500
              transition-colors duration-200
            `} {...props} />
          {rightIcon && <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${onRightIconClick ? 'cursor-pointer hover:text-gray-600' : ''}`} onClick={onRightIconClick}>
              {rightIcon}
            </div>}
        </div>
        {helperText && !error && <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>}
        {error && <p id={errorId} className="mt-1 text-sm text-error-600">
            {error}
          </p>}
      </div>;
});
Input.displayName = 'Input';
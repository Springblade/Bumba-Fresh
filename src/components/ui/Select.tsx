import React, { forwardRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  options: Array<{
    value: string;
    label: string;
  }>;
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  icon,
  options,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const helperTextId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  return <div className={className}>
        {label && <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>}
          <select ref={ref} id={selectId} aria-describedby={`${helperText ? helperTextId : ''} ${error ? errorId : ''}`} className={`
              block w-full rounded-lg border ${error ? 'border-error-300' : 'border-gray-300'}
              ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5
              text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500
              appearance-none
              transition-colors duration-200
            `} {...props}>
            {options.map(({
          value,
          label
        }) => <option key={value} value={value}>
                {label}
              </option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </div>
        {helperText && !error && <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>}
        {error && <p id={errorId} className="mt-1 text-sm text-error-600">
            {error}
          </p>}
      </div>;
});
Select.displayName = 'Select';
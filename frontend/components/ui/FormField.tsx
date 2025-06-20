import React, { useState, forwardRef } from 'react';
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  required?: boolean;
  validation?: {
    pattern?: RegExp;
    message?: string;
    minLength?: number;
    maxLength?: number;
  };
}
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({
  label,
  error,
  icon,
  helperText,
  className = '',
  required,
  id,
  validation,
  onChange,
  onBlur,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  const [localError, setLocalError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [touchedByKeyboard, setTouchedByKeyboard] = useState(false);
  const validateField = (value: string) => {
    if (!validation) return true;
    if (required && !value.trim()) {
      setLocalError('This field is required');
      setIsValid(false);
      return false;
    }
    if (validation.pattern && !validation.pattern.test(value)) {
      setLocalError(validation.message || 'Invalid format');
      setIsValid(false);
      return false;
    }
    if (validation.minLength && value.length < validation.minLength) {
      setLocalError(`Must be at least ${validation.minLength} characters`);
      setIsValid(false);
      return false;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      setLocalError(`Must be less than ${validation.maxLength} characters`);
      setIsValid(false);
      return false;
    }
    setLocalError('');
    setIsValid(true);
    return true;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDirty) {
      validateField(e.target.value);
    }
    onChange?.(e);
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setIsDirty(true);
    validateField(e.target.value);
    onBlur?.(e);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTouchedByKeyboard(true);
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const helperTextId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const displayError = error || localError;
  return <div className={`space-y-1.5 ${className}`}>
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <>
              <span className="text-error-500 ml-1" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </>}
        </label>
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">
              {icon}
            </div>}
          <input ref={ref} id={inputId} aria-describedby={`${helperText ? helperTextId : ''} ${displayError ? errorId : ''} ${ariaDescribedBy || ''}`} aria-invalid={!!displayError} aria-required={required} className={`
              w-full rounded-lg border transition-all duration-200
              ${displayError ? 'form-field-error' : ''}
              ${isFocused ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-300'}
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
              text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:bg-gray-50 disabled:text-gray-500
              ${!isValid ? 'animate-shake' : ''}
              ${touchedByKeyboard ? 'focus:ring-4' : ''}
            `} onChange={handleChange} onBlur={handleBlur} onFocus={() => setIsFocused(true)} onKeyDown={handleKeyDown} {...props} />
        </div>
        {helperText && !displayError && <p id={helperTextId} className="text-sm text-gray-500">
            {helperText}
          </p>}
        {displayError && <p id={errorId} className="text-sm text-error-600 animate-fade-in" role="alert">
            {displayError}
          </p>}
      </div>;
});
FormField.displayName = 'FormField';
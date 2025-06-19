import React, { forwardRef } from 'react';
import type { UseFormRegister, FieldValues, Path, FieldErrors } from 'react-hook-form';
interface FormFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  icon?: React.ReactNode;
  helperText?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  validationRules?: Record<string, any>;
}
export const FormFieldRHF = forwardRef<HTMLInputElement, FormFieldProps<FieldValues>>(({
  label,
  name,
  register,
  errors,
  icon,
  helperText,
  required,
  type = 'text',
  placeholder,
  className = '',
  disabled,
  validationRules,
  ...props
}, ref) => {
  const error = errors[name];
  const inputId = `field-${name}`;
  const errorId = `${inputId}-error`;
  const helperTextId = `${inputId}-helper`;
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
          <input ref={ref} id={inputId} type={type} disabled={disabled} placeholder={placeholder} aria-invalid={!!error} aria-describedby={`${helperText ? helperTextId : ''} ${error ? errorId : ''}`} className={`
              w-full rounded-lg border transition-all duration-200
              ${error ? 'form-field-error border-error-300' : 'border-gray-300'}
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
              text-gray-900 placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:bg-gray-50 disabled:text-gray-500
            `} {...register(name, validationRules)} {...props} />
        </div>
        {helperText && !error && <p id={helperTextId} className="text-sm text-gray-500">
            {helperText}
          </p>}
        {error && <p id={errorId} className="text-sm text-error-600 animate-fade-in" role="alert">
            {error.message?.toString()}
          </p>}
      </div>;
});
FormFieldRHF.displayName = 'FormFieldRHF';
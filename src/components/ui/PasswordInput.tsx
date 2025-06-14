import React, { useState, forwardRef } from 'react';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrengthMeter?: boolean;
}
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
  label,
  error,
  showStrengthMeter = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [strengthLabel, setStrengthLabel] = useState('');
  const calculateStrength = (value: string) => {
    let score = 0;
    let feedback = [];
    if (value.length >= 8) {
      score += 1;
    } else {
      feedback.push('Use at least 8 characters');
    }
    if (/[A-Z]/.test(value)) {
      score += 1;
    } else {
      feedback.push('Add uppercase letters');
    }
    if (/[0-9]/.test(value)) {
      score += 1;
    } else {
      feedback.push('Add numbers');
    }
    if (/[^A-Za-z0-9]/.test(value)) {
      score += 1;
    } else {
      feedback.push('Add special characters');
    }
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    setStrength(score);
    setStrengthLabel(labels[score - 1] || '');
    return feedback.join(', ');
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrengthMeter) {
      calculateStrength(e.target.value);
    }
    props.onChange?.(e);
  };
  const strengthColors = ['bg-error-500', 'bg-warning-500', 'bg-success-400', 'bg-success-500'];
  return <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <>
              <span className="text-error-500 ml-1" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </>}
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">
            <LockIcon className="h-5 w-5" />
          </div>
          <input ref={ref} type={showPassword ? 'text' : 'password'} className={`
              w-full rounded-lg border transition-all duration-200
              ${error ? 'border-error-300' : 'border-gray-300'}
              pl-10 pr-10 py-2.5
              text-gray-900 placeholder:text-gray-500
              focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              disabled:bg-gray-50 disabled:text-gray-500
            `} aria-invalid={!!error} onChange={handleChange} {...props} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-error-600" role="alert">
            {error}
          </p>}
        {showStrengthMeter && strength > 0 && <div className="mt-2">
            <div className="flex gap-1 mb-1" role="meter" aria-label="Password strength" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={4}>
              {[1, 2, 3, 4].map(level => <div key={level} className={`h-1 w-full rounded-full transition-colors duration-200 ${level <= strength ? strengthColors[level - 1] : 'bg-gray-200'}`} />)}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Password strength:{' '}
                <span className="font-medium">{strengthLabel}</span>
              </p>
              <p className="text-xs text-gray-500">
                {4 - strength} more criteria to secure password
              </p>
            </div>
          </div>}
      </div>;
});
PasswordInput.displayName = 'PasswordInput';
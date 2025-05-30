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
  const calculateStrength = (value: string) => {
    let score = 0;
    if (value.length > 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    setStrength(score);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrengthMeter) {
      calculateStrength(e.target.value);
    }
    props.onChange?.(e);
  };
  return <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <LockIcon className="h-5 w-5" />
          </div>
          <input ref={ref} type={showPassword ? 'text' : 'password'} className={`
              w-full rounded-lg border ${error ? 'border-red-300' : 'border-gray-300'}
              pl-10 pr-10 py-2.5
              text-gray-900 placeholder:text-gray-500
              focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
              transition-colors duration-200
            `} onChange={handleChange} {...props} />
          <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {showStrengthMeter && <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map(level => <div key={level} className={`h-1 w-full rounded-full transition-colors duration-200 ${level <= strength ? level <= 2 ? 'bg-red-500' : level === 3 ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`} />)}
            </div>
            <p className="text-xs text-gray-500">
              Use 8+ characters with a mix of letters, numbers & symbols
            </p>
          </div>}
      </div>;
});
PasswordInput.displayName = 'PasswordInput';
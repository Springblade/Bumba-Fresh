import React from 'react';
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'primary-to-secondary' | 'accent-to-secondary';
}
const GradientText = ({
  children,
  className = '',
  variant = 'primary'
}: GradientTextProps) => {
  const gradientClass = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-transparent bg-clip-text',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-transparent bg-clip-text',
    accent: 'bg-gradient-to-r from-accent-600 to-accent-500 text-transparent bg-clip-text',
    'primary-to-secondary': 'bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text',
    'accent-to-secondary': 'bg-gradient-to-r from-accent-500 to-secondary-500 text-transparent bg-clip-text'
  }[variant];
  return <span className={`${gradientClass} ${className}`}>{children}</span>;
};
export default GradientText;
import React from 'react';
interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
  animation?: 'pulse' | 'wave';
  width?: number | string;
  height?: number | string;
}
export const Skeleton = ({
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height
}: SkeletonProps) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton-wave'
  };
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };
  const style = {
    width: width,
    height: height
  };
  return <div className={`
        ${baseClasses}
        ${animationClasses[animation]}
        ${variantClasses[variant]}
        ${className}
      `} style={style} role="status" aria-label="Loading...">
      <span className="sr-only">Loading...</span>
    </div>;
};
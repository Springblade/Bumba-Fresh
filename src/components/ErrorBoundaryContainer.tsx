import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';
interface ErrorBoundaryContainerProps {
  children: React.ReactNode;
  name?: string;
  fallback?: React.ReactNode;
}
export const ErrorBoundaryContainer = ({
  children,
  name = 'component',
  fallback
}: ErrorBoundaryContainerProps) => {
  return <ErrorBoundary fallback={fallback || <ErrorFallback title={`${name} Error`} message={`There was an error in the ${name.toLowerCase()}`} />}>
      {children}
    </ErrorBoundary>;
};
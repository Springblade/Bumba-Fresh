import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';
interface ErrorBoundaryWrapperProps {
  name: string;
  children: React.ReactNode;
}
export const ErrorBoundaryWrapper = ({
  name,
  children
}: ErrorBoundaryWrapperProps) => {
  return <ErrorBoundary fallback={<ErrorFallback title={`${name} Error`} message="We're sorry, but something went wrong. Please try again or contact support if the problem persists." />}>
      {children}
    </ErrorBoundary>;
};
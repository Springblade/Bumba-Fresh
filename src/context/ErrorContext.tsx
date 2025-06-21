import React, { useCallback, useState, createContext, useContext } from 'react';
interface ErrorContextType {
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  handleError: (error: unknown) => void;
}
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);
export const ErrorProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [error, setError] = useState<Error | null>(null);
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error);
    } else if (typeof error === 'string') {
      setError(new Error(error));
    } else {
      setError(new Error('An unknown error occurred'));
    }
  }, []);
  return <ErrorContext.Provider value={{
    error,
    setError,
    clearError,
    handleError
  }}>
      {children}
    </ErrorContext.Provider>;
};
export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
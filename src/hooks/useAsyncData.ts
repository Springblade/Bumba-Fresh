import { useState, useEffect, useCallback } from 'react';

interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAsyncData<T>(
  fetchFn: () => Promise<T>, 
  dependencies: any[] = [],
  options = { retryCount: 0, retryDelay: 1000 }
) {
  const [state, setState] = useState<AsyncDataState<T>>({
    data: null,
    isLoading: true,
    error: null
  });
  const [retries, setRetries] = useState(0);

  const refetch = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
    
    try {
      const data = await fetchFn();
      setState({
        data,
        isLoading: false,
        error: null
      });
      setRetries(0);
    } catch (error) {
      console.error('API request failed:', error);
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      
      // Auto-retry logic
      if (retries < options.retryCount) {
        setTimeout(() => {
          setRetries(r => r + 1);
          refetch();
        }, options.retryDelay);
      }
    }
  }, [fetchFn, options.retryCount, options.retryDelay, retries]);

  useEffect(() => {
    refetch();
  }, dependencies);

  return {
    ...state,
    refetch
  };
}

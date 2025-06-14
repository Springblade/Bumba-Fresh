import { useState, useEffect, useCallback } from 'react';
interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}
export function useAsyncData<T>(fetchFn: () => Promise<T>, dependencies: any[] = []) {
  const [state, setState] = useState<AsyncDataState<T>>({
    data: null,
    isLoading: true,
    error: null
  });
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
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
    }
  }, [fetchFn]);
  useEffect(() => {
    refetch();
  }, dependencies);
  return {
    ...state,
    refetch
  };
}
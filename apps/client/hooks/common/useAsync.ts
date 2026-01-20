"use client";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/common/api";

export interface UseAsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseAsyncReturn<T, Args extends any[]> extends UseAsyncState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

export function useAsync<T, Args extends any[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: unknown) => void;
    initialData?: T | null;
  } = {}
): UseAsyncReturn<T, Args> {
  const { onSuccess, onError, initialData = null } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await asyncFn(...args);
        setState({ data: result, isLoading: false, error: null });
        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = getErrorMessage(error, "An error occurred");
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
        onError?.(error);
        return null;
      }
    },
    [asyncFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: initialData, isLoading: false, error: null });
  }, [initialData]);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
  };
}

import { toast } from "sonner";

export interface ApiError {
  data?: {
    message?: string;
    errors?: Record<string, string>;
    type?: string;
  };
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

export function getErrorMessage(
  error: ApiError | unknown,
  fallbackMessage: string = "An error occurred"
): string {
  if (!error) return fallbackMessage;

  const err = error as ApiError;

  if (err?.data?.message) {
    return err.data.message;
  }

  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.message) {
    return err.message;
  }

  return fallbackMessage;
}

export function handleApiError(
  error: ApiError | unknown,
  fallbackMessage: string = "An error occurred"
): void {
  const message = getErrorMessage(error, fallbackMessage);
  toast.error(message);
  console.error(fallbackMessage, error);
}

export function handleApiSuccess(message: string): void {
  toast.success(message);
}

export function isValidationError(error: ApiError | unknown): boolean {
  const err = error as ApiError;
  return err?.data?.type === "VALIDATION_ERROR" && !!err?.data?.errors;
}

export function getValidationErrors(
  error: ApiError | unknown
): Record<string, string> {
  const err = error as ApiError;
  if (isValidationError(err)) {
    return err.data?.errors || {};
  }
  return {};
}

export type AsyncOperation<T> = {
  execute: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError | unknown) => void;
  successMessage?: string;
  errorMessage?: string;
  setLoading?: (loading: boolean) => void;
};

export async function executeAsync<T>({
  execute,
  onSuccess,
  onError,
  successMessage,
  errorMessage = "An error occurred",
  setLoading,
}: AsyncOperation<T>): Promise<T | null> {
  try {
    setLoading?.(true);
    const result = await execute();
    if (successMessage) {
      handleApiSuccess(successMessage);
    }
    onSuccess?.(result);
    return result;
  } catch (error) {
    handleApiError(error, errorMessage);
    onError?.(error);
    return null;
  } finally {
    setLoading?.(false);
  }
}

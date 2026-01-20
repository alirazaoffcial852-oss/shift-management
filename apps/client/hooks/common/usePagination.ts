"use client";
import { useState, useCallback } from "react";

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  resetPage: () => void;
  updatePagination: (data: Partial<PaginationState>) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 20 } = options;

  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    total_pages: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setPagination((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination((prev) => {
      if (prev.page < prev.total_pages) {
        return { ...prev, page: prev.page + 1 };
      }
      return prev;
    });
  }, []);

  const prevPage = useCallback(() => {
    setPagination((prev) => {
      if (prev.page > 1) {
        return { ...prev, page: prev.page - 1 };
      }
      return prev;
    });
  }, []);

  const resetPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const updatePagination = useCallback((data: Partial<PaginationState>) => {
    setPagination((prev) => ({ ...prev, ...data }));
  }, []);

  return {
    pagination,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    resetPage,
    updatePagination,
    hasNextPage: pagination.page < pagination.total_pages,
    hasPrevPage: pagination.page > 1,
  };
}

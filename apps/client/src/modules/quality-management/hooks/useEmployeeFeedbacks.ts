"use client";

import * as React from "react";
import {
  fetchEmployeeFeedbacks,
  EmployeeFeedbackQuery,
  EmployeeFeedbackResponse,
} from "../api/employeeFeedbacks";

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export type UseEmployeeFeedbacksState = {
  search: string;
  dateRange: { from?: string; to?: string };
  filters: Record<string, string | number | boolean | null | undefined>;
  page: number;
  limit: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

const initialState: UseEmployeeFeedbacksState = {
  search: "",
  dateRange: {},
  filters: {},
  page: 1,
  limit: 10,
  sortBy: undefined,
  sortDir: undefined,
};

export function useEmployeeFeedbacks() {
  const [state, setState] =
    React.useState<UseEmployeeFeedbacksState>(initialState);
  const [data, setData] = React.useState<EmployeeFeedbackResponse>({
    rows: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(state.search, 400);
  const debouncedRange = useDebouncedValue(state.dateRange, 400);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const query: EmployeeFeedbackQuery = {
      search: debouncedSearch || undefined,
      dateFrom: debouncedRange.from,
      dateTo: debouncedRange.to,
      filters: state.filters,
      page: state.page,
      limit: state.limit,
      sortBy: state.sortBy,
      sortDir: state.sortDir,
    };
    try {
      const res = await fetchEmployeeFeedbacks(query);
      setData(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load employee feedbacks");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    debouncedRange,
    state.filters,
    state.page,
    state.limit,
    state.sortBy,
    state.sortDir,
  ]);

  React.useEffect(() => {
    load();
  }, [load]);

  const handlers = React.useMemo(
    () => ({
      setSearch: (v: string) => setState((s) => ({ ...s, search: v, page: 1 })),
      setDateRange: (from?: string, to?: string) =>
        setState((s) => ({ ...s, dateRange: { from, to }, page: 1 })),
      setFilter: (
        key: string,
        value: string | number | boolean | null | undefined
      ) =>
        setState((s) => ({
          ...s,
          filters: { ...s.filters, [key]: value },
          page: 1,
        })),
      setPage: (page: number) => setState((s) => ({ ...s, page })),
      setLimit: (limit: number) => setState((s) => ({ ...s, limit, page: 1 })),
      sort: (sortBy?: string, sortDir?: "asc" | "desc") =>
        setState((s) => ({ ...s, sortBy, sortDir, page: 1 })),
      reset: () => setState(initialState),
    }),
    []
  );

  return { state, data, loading, error, ...handlers };
}

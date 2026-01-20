"use client";
import { useState, useCallback, useEffect, useRef } from "react";

export interface UseSearchOptions {
  initialValue?: string;
  debounceMs?: number;
  onSearch?: (term: string) => void;
}

export interface UseSearchReturn {
  searchTerm: string;
  debouncedSearchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { initialValue = "", debounceMs = 300, onSearch } = options;

  const [searchTerm, setSearchTermState] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
      timeoutRef.current = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        setIsSearching(false);
        onSearchRef.current?.(searchTerm);
      }, debounceMs);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debounceMs, debouncedSearchTerm]);

  const setSearchTerm = useCallback((term: string) => {
    setSearchTermState(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTermState("");
    setDebouncedSearchTerm("");
    setIsSearching(false);
    onSearchRef.current?.("");
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    clearSearch,
    isSearching,
  };
}

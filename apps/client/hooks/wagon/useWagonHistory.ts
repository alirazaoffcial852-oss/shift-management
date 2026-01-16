"use client";

import { useState, useCallback, useEffect } from "react";
import WagonService from "@/services/wagon.service";
import { toast } from "sonner";

export interface WagonHistoryItem {
  id: number;
  usn_shift_id: number;
  wagon_id: number;
  current_location_id?: number;
  status: string;
  date: string;
  created_at: string;
  updated_at: string;
  usn_shift: {
    id: number;
    date: string;
    status: string;
  };
  wagon: {
    id: number;
    wagon_number: number;
  };
  current_location?: {
    id: number;
    name: string;
  };
}

export interface WagonHistoryFilters {
  wagon_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export const useWagonHistory = () => {
  const [history, setHistory] = useState<WagonHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<WagonHistoryFilters>({
    wagon_id: undefined,
    status: undefined,
    date_from: undefined,
    date_to: undefined,
  });

  const fetchWagonHistory = useCallback(
    async (
      page: number = 1,
      filters: WagonHistoryFilters = {},
      search: string = ""
    ) => {
      try {
        setIsLoading(true);
        const response = await WagonService.getWagonHistory({
          page,
          limit: 20,
          wagon_id: filters.wagon_id,
          status: filters.status,
          date_from: filters.date_from,
          date_to: filters.date_to,
          search: search || undefined,
        });

        if (response?.data?.data) {
          setHistory(response.data.data || []);
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.total_pages || 1);
            setTotal(response.data.pagination.total || 0);
          }
        } else if (response?.data) {
          setHistory(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error: any) {
        console.error("Error fetching wagon history:", error);
        toast.error(
          error?.response?.data?.message || "Failed to fetch wagon history"
        );
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchWagonHistory(currentPage, filters, searchTerm);
  }, [currentPage, filters, searchTerm, fetchWagonHistory]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Partial<WagonHistoryFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1);
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({
      wagon_id: undefined,
      status: undefined,
      date_from: undefined,
      date_to: undefined,
    });
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  return {
    history,
    currentPage,
    totalPages,
    total,
    isLoading,
    searchTerm,
    filters,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    clearFilters,
    refetch: () => fetchWagonHistory(currentPage, filters, searchTerm),
  };
};

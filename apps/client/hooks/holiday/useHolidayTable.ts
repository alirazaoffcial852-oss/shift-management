"use client";
import { useState, useCallback, useEffect } from "react";
import { Staff } from "@/types/staff";
import { useCompany } from "@/providers/appProvider";
import HolidayService from "@/services/holiday";
import { usePermission } from "@/hooks/usePermission";

export const useHolidayTable = (
  initialPage = 1,
  limit = 20,
  month?: number,
  year?: number
) => {
  const { company } = useCompany();
  const { hasPermission } = usePermission();

  const [holidays, setHolidays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchHolidays = useCallback(async () => {
    if (!hasPermission("settings.holiday")) {
      setHolidays([]);
      setTotalCount(0);
      setTotalPages(0);
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (company?.id === undefined) {
        throw new Error("Company ID is undefined");
      }

      const response = await HolidayService.getHoliday(
        currentPage,
        limit,
        company.id,
        month,
        year
      );

      setHolidays(response.data.data || []);
      setTotalCount(response.data.pagination.total || 0);
      setTotalPages(
        Math.ceil((response.data.pagination.total_pages || 0) / limit)
      );
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch holidays";
      setError(errorMsg);
      console.error("Error fetching holidays:", err);
      if (err?.response?.status === 403) {
        setHolidays([]);
        setTotalCount(0);
        setTotalPages(0);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, company?.id, month, year, hasPermission]);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  const removeHoliday = useCallback((holidayId: number) => {
    setHolidays((prevHolidays) =>
      prevHolidays.filter((holiday) => holiday.id !== holidayId)
    );
  }, []);

  return {
    setHolidays,
    holidays,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    removeHoliday,
    refetch: fetchHolidays,
  };
};

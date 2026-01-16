"use client";
import { useState, useCallback, useEffect } from "react";
import StaffService from "@/services/staff";
import { Staff } from "@/types/staff";
import { STATUS } from "@/types/shared/global";
import { useCompany } from "@/providers/appProvider";

export const useStaffTable = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (company?.id === undefined) {
        return;
      }
      const response = await StaffService.getAllStaff(
        currentPage,
        limit,
        company.id,
        tabValue
      );
      setStaff(response.data.data || []);
      setTotalCount(response.data.pagination.total || 0);
      setTotalPages(
        Math.ceil((response.data.pagination.total_pages || 0) / limit)
      );
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch staff";
      setError(errorMsg);
      console.error("Error fetching staff:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, tabValue, company]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff, tabValue]);
  const updateStaffStatus = useCallback(
    (staffId: number, newStatus: STATUS) => {
      setStaff((prevStaff) =>
        prevStaff.filter((staff: Staff) => staff.id !== staffId)
      );
    },
    []
  );
  const removeStaff = useCallback((staffId: number) => {
    setStaff((prevStaff) =>
      prevStaff.filter((staff: Staff) => staff.id !== staffId)
    );
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleTimeFilterChange = useCallback((value: string) => {
    setTimeFilter(value);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((value: any) => {
    setDateRange(value);
    setCurrentPage(1);
  }, []);

  return {
    tabValue,
    setTabValue,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    setStaff,
    staff: staff,
    rawClients: staff,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    removeStaff,
    updateStaffStatus,
    refetch: fetchStaff,
  };
};

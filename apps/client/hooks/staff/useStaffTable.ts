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
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(
    async (page = 1, searchTermParam = "") => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company?.id) {
          return;
        }

        const response = await StaffService.getAllStaff(
          page,
          pagination.limit,
          company.id as number,
          tabValue,
          searchTermParam
        );

        const newStaff = response.data?.data || [];
        setStaff(newStaff);

        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            total_pages: response.data.pagination.total_pages,
          });
        }

        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch staff";
        setError(errorMsg);
        console.error("Error fetching staff:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [company, pagination.limit, tabValue]
  );

  useEffect(() => {
    fetchStaff(pagination.page, searchTerm);
  }, [pagination.page, searchTerm, fetchStaff]);

  const handleTabChange = useCallback((value: STATUS) => {
    setTabValue(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

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
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleTimeFilterChange = useCallback((value: string) => {
    setTimeFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleDateRangeChange = useCallback((value: any) => {
    setDateRange(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const formattedStaff = staff.map((item: any, index: number) => ({
    id: (pagination.page - 1) * pagination.limit + index + 1,
    staffName: item.name,
    ...item,
  }));

  return {
    tabValue,
    setTabValue: handleTabChange,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    setStaff,
    staff: formattedStaff,
    rawStaff: staff,
    isLoading,
    error,
    pagination,
    totalCount: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    removeStaff,
    updateStaffStatus,
    refetch: () => fetchStaff(pagination.page, searchTerm),
  };
};

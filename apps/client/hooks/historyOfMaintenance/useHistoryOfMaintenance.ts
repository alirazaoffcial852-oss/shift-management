import { useCallback, useEffect, useState } from "react";
import historyOfMaintenanceService from "@/services/historyOfMaintenance";
import { FetchHistoryOfMaintenanceResponse } from "@/types/historyOfMaintenance";

export const useHistoryOfMaintenanceTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [historyOfMaintenanceData, setHistoryOfMaintenanceData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "none" | "search" | "date" | "status"
  >("none");

  const limit = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showPagination = activeFilter === "none";

  const fetchHistoryOfMaintenanceData = useCallback(
    async (
      page: number = 1,
      filters?: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
      }
    ): Promise<FetchHistoryOfMaintenanceResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit,
          search: filters?.search || searchTerm || undefined,
          status: filters?.status || statusFilter || undefined,
          startDate: filters?.startDate || startDate || undefined,
          endDate: filters?.endDate || endDate || undefined,
        };

        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        );

        const response =
          await historyOfMaintenanceService.getHistoryOfMaintenanceData(
            cleanParams
          );
        setHistoryOfMaintenanceData(response.data.data || []);
        setTotalCount(response.data.pagination.total || 0);
        setTotalPages(response.data.pagination.total_pages || 0);
        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch reasons";
        setError(errorMsg);
        console.error("Error fetching reasons:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, statusFilter, startDate, endDate]
  );

  useEffect(() => {
    fetchHistoryOfMaintenanceData(currentPage);
  }, [currentPage, fetchHistoryOfMaintenanceData]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchHistoryOfMaintenanceData(1);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const clearFilters = useCallback(async () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setActiveFilter("none");
    setCurrentPage(1);
    await fetchHistoryOfMaintenanceData(1, {
      search: "",
      startDate: "",
      endDate: "",
      status: "",
    });
  }, [fetchHistoryOfMaintenanceData]);

  const handleSearch = useCallback(
    async (searchValue: string) => {
      setSearchTerm(searchValue);
      setCurrentPage(1);

      if (!searchValue.trim()) {
        setActiveFilter("none");
        await fetchHistoryOfMaintenanceData(1, { search: "" });
        return;
      }

      setActiveFilter("search");
      await fetchHistoryOfMaintenanceData(1, { search: searchValue });
    },
    [fetchHistoryOfMaintenanceData]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      clearFilters();
    } else {
      handleSearch(value);
    }
  };

  const handleDateFilter = useCallback(
    async (startDateValue: string, endDateValue: string) => {
      setStartDate(startDateValue);
      setEndDate(endDateValue);
      setCurrentPage(1);

      if (!startDateValue || !endDateValue) {
        setActiveFilter("none");
        await fetchHistoryOfMaintenanceData(1, { startDate: "", endDate: "" });
        return;
      }

      setActiveFilter("date");
      await fetchHistoryOfMaintenanceData(1, {
        startDate: startDateValue,
        endDate: endDateValue,
      });
    },
    [fetchHistoryOfMaintenanceData]
  );

  const handleDateRangeChange = (dateRange: string) => {
    if (!dateRange || dateRange === "") {
      clearFilters();
      return;
    }
    const [startDate, endDate] = dateRange.split("|");
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      handleDateFilter(formattedStartDate, formattedEndDate);
    }
  };

  return {
    historyOfMaintenanceData,
    setIsLoading,
    isLoading,
    totalCount,
    totalPages,
    error,
    refetch: fetchHistoryOfMaintenanceData,
    setSearchTerm,
    searchTerm,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    handlePageChange,
    showPagination,
    handleSearchChange,
    handleDateRangeChange,
  };
};

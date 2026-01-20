"use client";
import { useState, useCallback, useEffect } from "react";
import { useAuth, useCompany } from "@/providers/appProvider";
import { Project } from "@/types/project";
import TimeSheetService from "@/services/timeSheet";
import { usePathname, useSearchParams } from "next/navigation";
import { Timesheet, TIMESHEET_STATUS } from "@/types/timeSheet";

export const useTimeSheetTable = (initialPage = 1, limit = 20) => {
  const pathname = usePathname();
  const { user } = useAuth();
  let userRole = user?.role?.name;
  const employeeId = user?.employeeId;
  let isClient = userRole === "CLIENT";

  const status = (pathname?.split("/").pop()?.toUpperCase() as TIMESHEET_STATUS) || undefined;

  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timeSheets, setTimeSheets] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });

  const { company } = useCompany();

  const fetchTimeSheet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!company && isClient) return;
      const response = await TimeSheetService.getTimeSheet(
        pagination.page,
        pagination.limit,
        status,
        company?.id.toString(),
        employeeId,
        searchTerm
      );
      if (response.data) {
        setTimeSheets(response.data.data || []);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.data.pagination.total || 0,
            total_pages: response.data.pagination.totalPages || 0,
          }));
        }
      }
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch timeSheets";
      setError(errorMsg);
      console.error("Error fetching timeSheets:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, status, company, employeeId, searchTerm, isClient]);

  const updateTimeSheetStatus = useCallback((timeSheetId: number[]) => {
    setTimeSheets((prevProjects) =>
      prevProjects.filter((project) => !timeSheetId.some((timesheet) => timesheet?.toString() === project.id?.toString()))
    );
  }, []);

  useEffect(() => {
    fetchTimeSheet();
  }, [pagination.page, searchTerm]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    handleSearch,
    setTimeSheets,
    timeSheets: timeSheets,
    isLoading,
    updateTimeSheetStatus,
    error,
    totalCount: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    onPageChange: (page: number) => setPagination((prev) => ({ ...prev, page })),
    refetch: fetchTimeSheet,
  };
};

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
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { company } = useCompany();

  const fetchTimeSheet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!company && isClient) return;
      const response = await TimeSheetService.getTimeSheet(currentPage, limit, status, company?.id.toString(), employeeId);
      setTimeSheets(response.data.data || []);
      setTotalCount(response.data.pagination.total || 0);
      setTotalPages(Math.ceil((response.data.pagination.totalPages || 0) / limit));
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch timeSheets";
      setError(errorMsg);
      console.error("Error fetching timeSheets:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, company]);

  const updateTimeSheetStatus = useCallback((timeSheetId: number[]) => {
    setTimeSheets((prevProjects) =>
      prevProjects.filter((project) => !timeSheetId.some((timesheet) => timesheet?.toString() === project.id?.toString()))
    );
  }, []);

  useEffect(() => {
    fetchTimeSheet();
  }, [fetchTimeSheet]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  return {
    handleSearch,
    setTimeSheets,
    timeSheets: timeSheets,
    isLoading,
    updateTimeSheetStatus,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    refetch: fetchTimeSheet,
  };
};

"use client";
import { useState, useCallback, useEffect } from "react";
import LocomotiveService from "@/services/locomotive";
import LocomotiveActionService from "@/services/locomotiveAction";
import { useCompany } from "@/providers/appProvider";
import { Locomotive } from "@/types/locomotive";
import { STATUS } from "@/types/shared/global";
import { OverviewOfLocomotive } from "@/types/locomotiveAction";

export const useLocomotiveTable = (initialPage = 1, limit = 20) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locomotives, setLocomotives] = useState<Locomotive[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const { company } = useCompany();

  const fetchLocomotive = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!company) return;

      const response = await LocomotiveService.getAllLocomotives(
        currentPage,
        limit,
        company.id as number,
        tabValue
      );

      const data = response.data;

      setLocomotives(data?.data || []);
      setTotalCount(data?.pagination?.total || 0);
      setTotalPages(Math.ceil((data?.pagination?.total_pages || 0) / limit));

      return response;
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to fetch locomotives";
      setError(errorMsg);
      console.error("Error fetching locomotives:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, company, tabValue]);

  useEffect(() => {
    fetchLocomotive();
  }, [fetchLocomotive]);

  const archiveLocomotive = useCallback((locomotiveId: number) => {
    setLocomotives((prev) => prev.filter((loco) => loco.id !== locomotiveId));
  }, []);

  const updateLocomotiveStatus = useCallback((id: number, status: STATUS) => {
    setLocomotives((prev) => prev.filter((loco) => loco.id !== id));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  return {
    handleSearch,
    setLocomotives,
    locomotives,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    archiveLocomotive,
    refetch: fetchLocomotive,
    tabValue,
    setTabValue,
    updateLocomotiveStatus,
    fetchLocomotive,
  };
};

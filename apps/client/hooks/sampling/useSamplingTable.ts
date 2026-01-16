"use client";
import { useState, useCallback, useEffect } from "react";
import SamplingService from "@/services/sampling";
import { useCompany } from "@/providers/appProvider";
import { STATUS } from "@/types/shared/global";
import { Sampling } from "@/types/Sampling";

interface FetchSamplingResponse {
  data: {
    data: Sampling[];
    pagination: {
      total: number;
      totalPages: number;
    };
  };
}

export const useSamplingTable = () => {
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [samplings, setSamplings] = useState<Sampling[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { company } = useCompany();

  const limit = 20;

  const fetchSampling = useCallback(
    async (currentPage: number = 0, companyId: number = company?.id || 0, status: STATUS, projectId?: number): Promise<FetchSamplingResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company) {
          return null;
        }
        const response = await SamplingService.getAllSampling(currentPage, limit, companyId);
        setSamplings(response.data.data || []);
        setTotalCount(response.data.pagination.total || 0);
        setTotalPages(Math.ceil((response.data.pagination.total_pages || 0) / limit));
        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch samplings";
        setError(errorMsg);
        console.error("Error fetching samplings:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, limit, company, tabValue]
  );

  const updateSampling = useCallback((bvProjectId: number) => {
    setSamplings((prevProjects) => prevProjects.filter((bvProject) => bvProject.id !== bvProjectId));
  }, []);

  useEffect(() => {
    fetchSampling(currentPage, company?.id || 0, tabValue);
  }, [fetchSampling, currentPage, company?.id, tabValue]);

  const removeSampling = useCallback((clientId: number) => {
    setSamplings((prevClients) => prevClients.filter((client: any) => client.id !== clientId));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  return {
    tabValue,
    setTabValue,
    handleSearch,
    setSamplings,
    samplings: samplings,
    isLoading,
    updateSampling,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    removeSampling,
    refetch: fetchSampling,
  };
};

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
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const [pagination, setPagination] = useState({
    page: 1,
    limit: limit,
    total: 0,
    total_pages: 0,
  });

  const { company } = useCompany();

  const fetchSampling = useCallback(
    async (page: number = pagination.page, companyId: number = company?.id || 0, status: STATUS, search: string = searchTerm): Promise<FetchSamplingResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company) {
          return null;
        }
        const response = await SamplingService.getAllSampling(page, limit, companyId, search);
        
        // Destructure from response.data (middle object), NOT response.data.data
        if (response.data) {
          const { data: samplingList, pagination: paginationData } = response.data;
          
          if (samplingList) {
            setSamplings(samplingList);
          }
          
          if (paginationData) {
            setPagination({
              page: paginationData.page,
              limit: paginationData.limit,
              total: paginationData.total,
              total_pages: paginationData.total_pages,
            });
          }
        }
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
    [pagination.page, limit, company, tabValue, searchTerm]
  );

  const updateSampling = useCallback((bvProjectId: number) => {
    setSamplings((prevProjects) => prevProjects.filter((bvProject) => bvProject.id !== bvProjectId));
  }, []);

  useEffect(() => {
    fetchSampling(pagination.page, company?.id || 0, tabValue, searchTerm);
  }, [pagination.page, company?.id, tabValue, searchTerm]);

  const removeSampling = useCallback((clientId: number) => {
    setSamplings((prevClients) => prevClients.filter((client: any) => client.id !== clientId));
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 }));
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
    totalCount: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) => setPagination(prev => ({ ...prev, page })),
    removeSampling,
    refetch: () => fetchSampling(pagination.page, company?.id || 0, tabValue, searchTerm),
    onPageChange: (page: number) => setPagination(prev => ({ ...prev, page })),
  };
};

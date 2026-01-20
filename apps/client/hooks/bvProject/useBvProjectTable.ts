"use client";
import React, { useState, useCallback, useEffect } from "react";
import BvProjectService from "@/services/bvProject";
import { useCompany } from "@/providers/appProvider";
import { Project } from "@/types/project";
import { STATUS } from "@/types/shared/global";

interface FetchBvProjectResponse {
  data: {
    data: Project[];
    pagination: {
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    };
  };
}

export const useBvProjectTable = () => {
  const { company } = useCompany();
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bvProjects, setBvProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const limit = 20;
  const isManualModeRef = React.useRef(false);

  const fetchBvProjects = useCallback(
    async (
      page = 1,
      searchTermParam = "",
      projectId?: number
    ): Promise<FetchBvProjectResponse | null> => {
      setIsLoading(true);
      setError(null);
      if (projectId !== undefined) {
        isManualModeRef.current = true;
      }
      try {
        if (!company?.id) {
          return null;
        }
        const response = await BvProjectService.getAllBvProjects(
          page,
          limit,
          company.id,
          tabValue,
          projectId,
          searchTermParam
        );

        const newBvProjects = response.data.data || [];

        if (page === 1) {
          setBvProjects(newBvProjects);
        } else {
          setBvProjects((prev) => [...prev, ...newBvProjects]);
        }

        setTotalCount(response.data.pagination.total || 0);
        setTotalPages(response.data.pagination.totalPages || 0);

        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch BV projects";
        setError(errorMsg);
        console.error("Error fetching BV projects:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [company, limit, tabValue]
  );

  useEffect(() => {
    if (isManualModeRef.current || !company?.id) {
      return;
    }
    fetchBvProjects(currentPage, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, company?.id]);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleTabChange = useCallback((val: STATUS) => {
    setTabValue(val);
    setCurrentPage(1);
  }, []);

  const updateBvProjectStatus = useCallback((bvProjectId: number) => {
    setBvProjects((prevProjects) =>
      prevProjects.filter((bvProject) => bvProject.id !== bvProjectId)
    );
  }, []);

  const removeBvProject = useCallback((clientId: number) => {
    setBvProjects((prevClients) =>
      prevClients.filter((client: any) => client.id !== clientId)
    );
  }, []);

  return {
    tabValue,
    setTabValue: handleTabChange,
    handleSearch,
    setBvProjects,
    bvProjects: bvProjects,
    isLoading,
    updateBvProjectStatus,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    removeBvProject,
    refetch: () => fetchBvProjects(currentPage, searchTerm),
    fetchBvProjectsWithSearch: fetchBvProjects,
  };
};

"use client";
import { useState, useCallback, useEffect } from "react";
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
    };
  };
}

export const useBvProjectTable = () => {
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [bvProjects, setBvProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { company } = useCompany();

  const limit = 20;

  const fetchBvProject = useCallback(
    async (
      currentPage: number = 0,
      companyId: number = company?.id || 0,
      status: STATUS,
      projectId?: number
    ): Promise<FetchBvProjectResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company) {
          return null;
        }
        const response = await BvProjectService.getAllBvProjects(
          currentPage,
          limit,
          companyId,
          status,
          projectId
        );
        setBvProjects(response.data.data || []);

        setTotalCount(response.data.pagination.total || 0);
        setTotalPages(
          Math.ceil((response.data.pagination.totalPages || 0) / limit)
        );
        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch bvProjects";
        setError(errorMsg);
        console.error("Error fetching bvProjects:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, limit, company, tabValue]
  );

  const fetchBvProjectsWithSearch = useCallback(
    async (page = 1, searchTerm = "", projectId?: number) => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company) {
          return null;
        }
        const response = await BvProjectService.getAllBvProjects(
          page,
          limit,
          company.id,
          tabValue,
          projectId,
          searchTerm
        );

        const newBvProjects = response.data.data || [];

        if (page === 1) {
          setBvProjects(newBvProjects);
        } else {
          setBvProjects((prev) => [...prev, ...newBvProjects]);
        }

        setTotalCount(response.data.pagination.total || 0);
        setTotalPages(
          Math.ceil((response.data.pagination.totalPages || 0) / limit)
        );
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

  const updateBvProjectStatus = useCallback((bvProjectId: number) => {
    setBvProjects((prevProjects) =>
      prevProjects.filter((bvProject) => bvProject.id !== bvProjectId)
    );
  }, []);

  useEffect(() => {
    fetchBvProject(currentPage, company?.id || 0, tabValue);
  }, [fetchBvProject, currentPage, company?.id, tabValue]);

  const removeBvProject = useCallback((clientId: number) => {
    setBvProjects((prevClients) =>
      prevClients.filter((client: any) => client.id !== clientId)
    );
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  return {
    tabValue,
    setTabValue,
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
    refetch: fetchBvProject,
    fetchBvProjectsWithSearch,
  };
};

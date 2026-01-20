"use client";
import { useState, useCallback, useEffect } from "react";
import ProjectService from "@/services/project";
import { useCompany } from "@/providers/appProvider";
import { Project } from "@/types/project";
import { STATUS } from "@/types/shared/global";

export const useProjectTable = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(
    async (page = 1, searchTermParam = "") => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company?.id) {
          return;
        }

        const response = await ProjectService.getAllProjects(page, pagination.limit, company.id as number, tabValue, searchTermParam);

        const newProjects = response.data?.data || [];

        // Always replace projects for standard pagination
        setProjects(newProjects);

        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            total_pages: response.data.pagination.totalPages,
          });
        }

        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch projects";
        setError(errorMsg);
        console.error("Error fetching projects:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [company, pagination.limit, tabValue]
  );

  useEffect(() => {
    fetchProjects(pagination.page, searchTerm);
  }, [pagination.page, searchTerm, fetchProjects]);

  const handleLoadMoreProjects = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, pagination.total_pages]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleTabChange = useCallback((val: STATUS) => {
    setTabValue(val);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const updateProjectStatus = useCallback((projectId: number) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
  }, []);

  const removeProject = useCallback((projectId: number) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
  }, []);

  const formattedProjects = projects.map((project: any, index: number) => ({
    id: (pagination.page - 1) * pagination.limit + index + 1,
    projectName: project.name,
    ...project,
  }));

  return {
    tabValue,
    setTabValue: handleTabChange,
    handleSearchProjects: handleSearch,
    handleSearch,
    setProjects,
    projects: formattedProjects,
    rawProjects: projects,
    updateProjectStatus,
    isLoading,
    error,
    pagination,
    handleLoadMoreProjects,
    removeProject,
    refetch: () => fetchProjects(pagination.page, searchTerm),
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) => setPagination((prev) => ({ ...prev, page })),
  };
};

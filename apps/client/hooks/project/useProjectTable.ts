"use client";
import { useState, useCallback, useEffect } from "react";
import ProjectService from "@/services/project";
import { useCompany } from "@/providers/appProvider";
import { Project } from "@/types/project";
import { STATUS } from "@/types/shared/global";

export const useProjectTable = (initialPage = 1, limit = 20) => {
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const { company } = useCompany();

  const fetchProjects = useCallback(
    async (page = 1, searchTerm = "") => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company?.id) {
          return;
        }

        const response = await ProjectService.getAllProjects(page, pagination.limit, company.id as number, tabValue, searchTerm);

        const newProjects = response.data?.data || [];

        if (page === 1) {
          setProjects(newProjects);
        } else {
          setProjects((prev) => [...prev, ...newProjects]);
        }

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
    fetchProjects(1, "");
  }, [fetchProjects]);

  const handleLoadMoreProjects = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      fetchProjects(pagination.page + 1, searchTerm);
    }
  }, [pagination, searchTerm, fetchProjects]);

  const handleSearchProjects = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchProjects(1, searchTerm);
    },
    [fetchProjects]
  );

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

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchProjects(1, searchTerm);
    },
    [fetchProjects]
  );

  return {
    tabValue,
    setTabValue,
    handleSearchProjects,
    setProjects,
    projects: formattedProjects,
    rawProjects: projects,
    updateProjectStatus,
    isLoading,
    error,
    pagination,
    handleLoadMoreProjects,
    removeProject,
    refetch: () => fetchProjects(1, ""),
    setCurrentPage: (page: number) => setPagination((prev) => ({ ...prev, page })),
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    handleSearch,
  };
};

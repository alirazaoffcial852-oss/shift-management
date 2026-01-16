import { useState, useCallback } from "react";
import { Employee } from "@/types/employee";
import EmployeeService from "@/services/employee";
import { useCompany } from "@/providers/appProvider";

export const useRoleEmployees = (
  roleId: string,
  initialEmployee?: Employee
) => {
  const { company } = useCompany();
  const [employees, setEmployees] = useState<Employee[]>(
    initialEmployee ? [initialEmployee] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });

  const fetchEmployees = useCallback(
    async (page = 1, searchTerm = "") => {
      if (!company?.id || !roleId) return;

      try {
        setIsLoading(true);
        const response = await EmployeeService.getAllEmployees(
          page,
          pagination.limit,
          company.id,
          "ACTIVE",
          roleId,
          searchTerm
        );

        if (response?.data) {
          const newEmployees = response.data.data;
          setEmployees((prev) =>
            page === 1 ? newEmployees : [...prev, ...newEmployees]
          );
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    },
    [company?.id, roleId, pagination.limit]
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchEmployees(1, searchTerm);
    },
    [fetchEmployees]
  );

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      fetchEmployees(pagination.page + 1);
    }
  }, [fetchEmployees, pagination.page, pagination.total_pages]);

  return {
    employees,
    isLoading,
    isInitialized,
    pagination,
    handleSearch,
    handleLoadMore,
    initialize: () => !isInitialized && fetchEmployees(1, ""),
  };
};

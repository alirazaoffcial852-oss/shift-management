"use client";
import { useState, useCallback, useEffect } from "react";
import EmployeeService from "@/services/employee";
import { useCompany } from "@/providers/appProvider";
import { STATUS } from "@/types/shared/global";

export const useEmployeeTable = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(
    async (page = 1, searchTerm = "") => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company?.id) {
          return;
        }

        const response = await EmployeeService.getAllEmployees(page, pagination.limit, company.id as number, tabValue, searchTerm);

        const newEmployees = response.data?.data || [];

        if (page === 1) {
          setEmployees(newEmployees);
        } else {
          setEmployees((prev) => [...prev, ...newEmployees]);
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
        const errorMsg = err.message || "Failed to fetch employees";
        setError(errorMsg);
        console.error("Error fetching employees:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [company, pagination.limit, tabValue]
  );

  useEffect(() => {
    fetchEmployees(1, "");
  }, [fetchEmployees]);

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      fetchEmployees(pagination.page + 1, searchTerm);
    }
  }, [pagination, searchTerm, fetchEmployees]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchEmployees(1, searchTerm);
    },
    [fetchEmployees]
  );

  const removeEmployee = useCallback((employeeId: number) => {
    setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== employeeId));
  }, []);

  const updateEmployeeStatus = useCallback((employeeId: number) => {
    setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== employeeId));
  }, []);

  const formattedEmployees = employees.map((employee: any, index: number) => ({
    id: (pagination.page - 1) * pagination.limit + index + 1,
    employeeName: employee.name,
    ...employee,
  }));

  return {
    tabValue,
    setTabValue,
    handleSearch,
    setEmployees,
    employees: formattedEmployees,
    rawEmployees: employees,
    updateEmployeeStatus,
    isLoading,
    error,
    pagination,
    handleLoadMore,
    removeEmployee,
    refetch: () => fetchEmployees(1, ""),
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) => setPagination((prev) => ({ ...prev, page })),
  };
};

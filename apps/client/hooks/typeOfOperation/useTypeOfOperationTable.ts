"use client";
import { useState, useCallback, useEffect } from "react";
import typeOfOperationService from "@/services/typeOfOperation";
import { useCompany } from "@/providers/appProvider";
import { TypeOfOperation } from "@/types/typeOfOperation";
import { usePermission } from "@/hooks/usePermission";

export const useTypeOfOperationTable = (initialPage = 1, limit = 20) => {
  const [typeOfOperations, setTypeOfOperations] = useState<TypeOfOperation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { company } = useCompany();
  const { hasPermission, hasAnyPermission } = usePermission();

  const fetchTypeOfOperations = useCallback(
    async (page = 1, searchTerm = "") => {
      if (
        !company?.id ||
        !hasAnyPermission([
          "settings.operation-type",
          "type-of-operation.read",
          "shift.create",
          "shift.update",
          "shift.read",
          "usn-shift.create",
          "usn-shift.update",
          "usn-shift.read",
        ])
      )
        return;

      setIsLoading(true);
      try {
        const response = await typeOfOperationService.getAllTypeOfOperation(
          page,
          limit,
          company.id,
          searchTerm
        );

        const newOperations = response.data?.data || [];

        if (page === 1) {
          setTypeOfOperations(newOperations);
        } else {
          setTypeOfOperations((prev) => [...prev, ...newOperations]);
        }

        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          total_pages: response.data.pagination.total_pages,
        });
      } catch (error: any) {
        console.error("Error fetching type of operations:", error);
        if (error?.response?.status === 403) {
          setTypeOfOperations([]);
          setPagination({
            page: 1,
            limit: limit,
            total: 0,
            total_pages: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [company?.id, limit, hasAnyPermission]
  );
  const removeTypeOfOperation = useCallback((id: number) => {
    setTypeOfOperations((prev) =>
      prev.filter((typeOfOperation: any) => typeOfOperation.id !== id)
    );
  }, []);
  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      fetchTypeOfOperations(pagination.page + 1, searchQuery);
    }
  }, [pagination, searchQuery, fetchTypeOfOperations]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchTypeOfOperations(1, searchTerm);
    },
    [fetchTypeOfOperations]
  );

  useEffect(() => {
    fetchTypeOfOperations(1, "");
  }, [fetchTypeOfOperations]);

  return {
    typeOfOperations,
    isLoading,
    pagination,
    handleLoadMore,
    handleSearch,
    searchQuery,
    removeTypeOfOperation,
    refetch: () => fetchTypeOfOperations(1, ""),
    fetchTypeOfOperations,
  };
};

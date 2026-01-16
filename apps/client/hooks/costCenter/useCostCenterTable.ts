"use client";
import { useState, useCallback, useEffect } from "react";
import costCenterService from "@/services/costCenter";
import { useCompany } from "@/providers/appProvider";
import { CostCenter } from "@/types/costCenter";
import { usePermission } from "@/hooks/usePermission";

export const useCostCenterTable = (initialPage = 1, limit = 20) => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
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

  const fetchCostCenters = useCallback(
    async (page = 1, searchTerm = "") => {
      if (
        !company?.id ||
        !hasAnyPermission([
          "settings.cost-center",
          "cost-center.read",
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
        const response = await costCenterService.getAllCostCenter(
          page,
          limit,
          company.id,
          searchTerm
        );

        const newCostCenters = response.data?.data || [];

        if (page === 1) {
          setCostCenters(newCostCenters);
        } else {
          setCostCenters((prev) => [...prev, ...newCostCenters]);
        }

        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          total_pages: response.data.pagination.total_pages,
        });
      } catch (error: any) {
        console.error("Error fetching cost centers:", error);
        if (error?.response?.status === 403) {
          setCostCenters([]);
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

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      fetchCostCenters(pagination.page + 1, searchQuery);
    }
  }, [pagination, searchQuery, fetchCostCenters]);

  const removeCostCenter = useCallback((id: number) => {
    setCostCenters((prev) =>
      prev.filter((costCenter: any) => costCenter.id !== id)
    );
  }, []);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchCostCenters(1, searchTerm);
    },
    [fetchCostCenters]
  );

  useEffect(() => {
    fetchCostCenters(1, "");
  }, [fetchCostCenters]);

  return {
    costCenters,
    isLoading,
    pagination,
    removeCostCenter,
    handleLoadMore,
    handleSearch,
    fetchCostCenters,
    searchQuery,
    refetch: () => fetchCostCenters(1, ""),
  };
};

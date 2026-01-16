// hooks/useClientTable.ts
"use client";
import { useState, useCallback, useEffect } from "react";
import ClientService from "@/services/client";
import { Client } from "@workspace/ui/types/client";

type TabValueType = "Active" | "Archived";

export const useClientTable = (initialPage = 1, limit = 20) => {
  const [tabValue, setTabValue] = useState<TabValueType>("Active");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ClientService.getAllClients(currentPage, limit);
      setClients(response.data.data || []);
      setTotalCount(response.data.pagination.total || 0);
      setTotalPages(
        Math.ceil((response.data.pagination.total_pages || 0) / limit)
      );
      return response;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch clients";
      setError(errorMsg);
      console.error("Error fetching clients:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const removeClient = useCallback((clientId: number) => {
    setClients((prevClients) =>
      prevClients.filter((client: any) => client.id !== clientId)
    );
  }, []);

  const updateClientStatus = useCallback(
    (
      clientId: number,
      newStatus: "CAN_LOGIN" | "CAN_NOT_LOGIN" | "SUSPEND_DUE_TO_PAYMENT"
    ) => {
      setClients((prevClients) =>
        prevClients.map((client: any) =>
          client.id === clientId ? { ...client, status: newStatus } : client
        )
      );
    },
    []
  );

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  const handleTimeFilterChange = useCallback((value: string) => {
    setTimeFilter(value);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((value: any) => {
    setDateRange(value);
    setCurrentPage(1);
  }, []);

  const formattedClients = clients.map((client: any, index: number) => ({
    id: (currentPage - 1) * limit + index + 1,
    clientName: client.name,
    email: client.email,
    ...client,
  }));

  return {
    tabValue,
    setTabValue,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    setClients,
    clients: formattedClients,
    rawClients: clients,
    isLoading,
    error,
    totalCount,
    currentPage,
    totalPages,
    setCurrentPage,
    removeClient,
    updateClientStatus,
    refetch: fetchClients,
  };
};

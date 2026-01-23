"use client";
import { useState, useCallback, useEffect } from "react";
import CustomerService from "@/services/customer";
import { useCompany } from "@/providers/appProvider";
import { STATUS } from "@/types/shared/global";

export const useCustomerTable = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(
    async (page = 1, searchTermParam = "") => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company?.id) {
          return;
        }

        const response = await CustomerService.getAllCustomers(page, pagination.limit, company.id as number, tabValue, searchTermParam);

        const newCustomers = response.data?.data || [];

        // Always replace customers for standard pagination
        setCustomers(newCustomers);

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
        const errorMsg = err.message || "Failed to fetch customers";
        setError(errorMsg);
        console.error("Error fetching customers:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [company, pagination.limit, tabValue]
  );

  useEffect(() => {
    fetchCustomers(pagination.page, searchTerm);
  }, [pagination.page, searchTerm, fetchCustomers]);

  const handleLoadMoreCustomers = useCallback(() => {
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

  const removeCustomer = useCallback((clientId: number) => {
    setCustomers((prevClients) => prevClients.filter((client: any) => client.id !== clientId));
  }, []);

  const updateCustomerStatus = useCallback((customerId: number) => {
    setCustomers((preCustomer) => preCustomer.filter((customer) => customer.id !== customerId));
  }, []);

  const handleTimeFilterChange = useCallback((value: string) => {
    setTimeFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleDateRangeChange = useCallback((value: any) => {
    setDateRange(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const formattedCustomers = customers.map((customer: any, index: number) => ({
    id: (pagination.page - 1) * pagination.limit + index + 1,
    clientName: customer.name,
    email: customer.email,
    ...customer,
  }));

  return {
    tabValue,
    setTabValue: handleTabChange,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    setCustomers,
    customers: formattedCustomers,
    rawClients: customers,
    updateCustomerStatus,
    isLoading,
    error,
    pagination,
    handleLoadMoreCustomers,
    removeCustomer,
    refetch: () => fetchCustomers(pagination.page, searchTerm),
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
  };
};


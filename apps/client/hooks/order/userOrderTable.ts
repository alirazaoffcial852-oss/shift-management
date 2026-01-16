"use client";
import { useState, useCallback, useEffect } from "react";
import OrderService from "@/services/order.service";
import { useCompany } from "@/providers/appProvider";
import { Order } from "@/types/order";

export const useOrderTable = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(
    async (page = 1, searchTerm = "") => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company?.id) {
          return;
        }

        const response = await OrderService.getAllOrders(
          page,
          pagination.limit,
          searchTerm
        );

        const newOrders = response.data?.data || [];

        if (page === 1) {
          setOrders(newOrders);
        } else {
          setOrders((prev) => [...prev, ...newOrders]);
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
        const errorMsg = err.message || "Failed to fetch orders";
        setError(errorMsg);
        console.error("Error fetching orders:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [company, pagination.limit]
  );

  useEffect(() => {
    fetchOrders(1, "");
  }, [fetchOrders]);

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      fetchOrders(pagination.page + 1, searchTerm);
    }
  }, [pagination, searchTerm, fetchOrders]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchOrders(1, searchTerm);
    },
    [fetchOrders]
  );

  const removeOrder = useCallback((orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  }, []);

  const updateOrderStatus = useCallback((orderId: number) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  }, []);

  return {
    orders,
    isLoading,
    pagination,
    searchTerm,
    error,
    fetchOrders: () => fetchOrders(1, ""),
    handleLoadMore,
    handleSearch,
    removeOrder,
    updateOrderStatus,
  };
};

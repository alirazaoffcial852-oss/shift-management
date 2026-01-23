import { useState, useEffect, useCallback } from "react";
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";
import { Order } from "@/types/order";
import { useRouter, useSearchParams } from "next/navigation";
import OrderService from "@/services/order.service";
import { useCompany } from "@/providers/appProvider";
import { toast } from "sonner";

export const useOrderCalendar = (view?: "weekly" | "monthly") => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { company } = useCompany();

  const initializeDate = () => {
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    if (yearParam && monthParam) {
      const year = parseInt(yearParam);
      const month = parseInt(monthParam) - 1;
      return new Date(year, month, 1);
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState<Date>(initializeDate);
  const [totalDays, setTotalDays] = useState<number[]>([]);
  const [skipDays, setSkipDays] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedOrder, setDraggedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await OrderService.getAllOrders(1, 100);
      if (response?.data?.data) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUrlWithDate = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const params = new URLSearchParams(searchParams.toString());
      params.set("year", year.toString());
      params.set("month", month.toString());

      setTimeout(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      }, 0);
    },
    [router, searchParams]
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handlePreviousWeek = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = subWeeks(prevDate, 1);
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleNextWeek = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = addWeeks(prevDate, 1);
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleMonthYearSelect = useCallback(
    (year: number, month: number) => {
      const newDate = new Date(year, month, 1);
      setCurrentDate(newDate);
      updateUrlWithDate(newDate);
    },
    [updateUrlWithDate]
  );

  const handleOrderClick = useCallback(
    (order: Order) => {
      const currentPath = window.location.pathname;
      let currentView = "monthly";

      if (currentPath.includes("/weekly")) {
        currentView = "weekly";
      } else if (currentPath.includes("/table")) {
        currentView = "table";
      }

      if (currentView === "weekly" || currentView === "table") {
        router.push(
          `/shift-management/orders-shifts/monthly/${order.id}?returnTo=${currentView}`
        );
      } else {
        router.push(
          `/shift-management/orders-shifts/${currentView}/${order.id}?returnTo=${currentView}`
        );
      }
    },
    [router]
  );

  const handleOrderSelect = useCallback((order: Order) => {
    setSelectedOrders((prev) => {
      const isSelected = prev.some((o) => o.id === order.id);
      if (isSelected) {
        return prev.filter((o) => o.id !== order.id);
      } else {
        return [...prev, order];
      }
    });
  }, []);

  const clearSelectedOrders = useCallback(() => {
    setSelectedOrders([]);
  }, []);

  const handleDragStart = useCallback((order: Order) => {
    setDraggedOrder(order);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedOrder(null);
  }, []);

  const handleDrop = useCallback(
    async (targetDate: Date) => {
      if (!draggedOrder) return;

      const newDate = format(targetDate, "yyyy-MM-dd");

      try {
        const currentOrderResponse = await OrderService.getOrderById(
          draggedOrder.id
        );

        const orderData = currentOrderResponse.data;

        const formData = new FormData();
        formData.append("supplier_id", orderData.supplier_id.toString());
        formData.append("tariff_id", orderData.tariff_id.toString());
        formData.append("delivery_date", newDate);
        formData.append("type_of_wagon", orderData.type_of_wagon);
        formData.append("no_of_wagons", orderData.no_of_wagons.toString());
        formData.append("tonnage", orderData.tonnage.toString());
        formData.append("distance_in_km", orderData.distance_in_km.toString());
        formData.append("return_schedule", orderData.return_schedule);

        await OrderService.updateOrder(draggedOrder.id, formData);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === draggedOrder.id
              ? { ...order, delivery_date: newDate }
              : order
          )
        );

        toast.success("Order delivery date updated successfully");
      } catch (error: any) {
        console.error("Error updating order date:", error);
        const errorMessage =
          error?.data?.errors?.delivery_date?.[0] ||
          error?.data?.message ||
          "Failed to update order delivery date";
        toast.error(errorMessage);
      }
    },
    [draggedOrder]
  );

  const handleDeleteOrder = useCallback(async (orderId: number) => {
    try {
      await OrderService.deleteOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      setSelectedOrders((prev) => prev.filter((order) => order.id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (view === "weekly") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else if (view === "monthly") {
      const calculateDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = startOfMonth(new Date(year, month));
        const daysInMonth = getDaysInMonth(new Date(year, month));
        const startOfMonthDay = getDay(firstDayOfMonth);
        const adjustedStartOfMonthDay =
          startOfMonthDay === 0 ? 6 : startOfMonthDay - 1;

        const currentMonthName = new Date(year, month).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
          }
        );

        setTotalDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        setSkipDays(
          Array.from({ length: adjustedStartOfMonthDay }, (_, i) => i + 1)
        );
        setCurrentMonth(currentMonthName);
      };

      calculateDaysInMonth();
    }
  }, [currentDate, view]);

  return {
    currentDate,
    currentMonth,
    totalDays,
    skipDays,
    selectedOrders,
    orders,
    setOrders,
    isLoading,
    draggedOrder,
    handlePreviousMonth,
    handleNextMonth,
    handlePreviousWeek: view === "weekly" ? handlePreviousWeek : undefined,
    handleNextWeek: view === "weekly" ? handleNextWeek : undefined,
    handleMonthYearSelect,
    handleOrderClick,
    handleOrderSelect,
    clearSelectedOrders,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDeleteOrder,
    fetchOrders,
  };
};

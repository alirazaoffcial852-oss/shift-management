import { Order } from "@/types/order";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const groupOrdersByDate = (orders: Order[]) =>
  orders.reduce(
    (acc, order) => {
      const rawDate = order.delivery_date || order.date;
      const dateKey = rawDate
        ? format(new Date(rawDate), "yyyy-MM-dd")
        : "Invalid Date";
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(order);
      return acc;
    },
    {} as { [key: string]: Order[] }
  );

export const getOrdersForDay = (
  orders: Order[],
  date: Date,
  groupedOrders: { [key: string]: Order[] }
) => {
  const dateKey = format(date, "yyyy-MM-dd");
  return groupedOrders[dateKey] || [];
};

export const handlePreviousMonth = (
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
) => {
  setCurrentDate((prevDate) => {
    return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
  });
};

export const handleNextMonth = (
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
) => {
  setCurrentDate((prevDate) => {
    return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
  });
};

export const handleOrderSelect = (
  orderId: number,
  setSelectedOrders: React.Dispatch<React.SetStateAction<Set<number>>>
) => {
  setSelectedOrders((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(orderId)) {
      newSet.delete(orderId);
    } else {
      newSet.add(orderId);
    }
    return newSet;
  });
};

export const handleOrderClick = (order: Order) => {
  console.log("Order clicked:", order);
};

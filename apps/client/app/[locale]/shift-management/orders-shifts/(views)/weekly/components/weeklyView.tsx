"use client";
import React from "react";
import { format } from "date-fns";
import { useOrderCalendar } from "@/hooks/order/useOrderCalendar";
import OrderActions from "@/components/OrderActions";
import { OrderDayCell } from "@/components/OrderCalendar/OrderDayCell";
import { getWeekDays, groupOrdersByDate } from "@/utils/orderCalendar";
import OrderStatusLegend from "@/components/OrderCalendar/OrderStatusLegend";
import WeekSelector from "./WeekSelector";
import { useTranslations } from "next-intl";

export default function WeeklyView() {
  const {
    currentDate,
    selectedOrders,
    orders,
    setOrders,
    handleOrderClick,
    handleOrderSelect,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDeleteOrder,
    draggedOrder,
    handlePreviousWeek,
    handleNextWeek,
    fetchOrders,
  } = useOrderCalendar("weekly");

  const t = useTranslations("pages.calandar.days");
  const weekDays = getWeekDays(currentDate);
  const groupedOrders = groupOrdersByDate(orders || []);

  const handleImportSuccess = () => {
    fetchOrders();
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <OrderActions
          selectedOrdersCount={selectedOrders.length}
          selectedOrders={selectedOrders}
          onImportSuccess={handleImportSuccess}
        />
      </div>

      <div className="w-full max-w-full bg-white shadow-md rounded-[32px] overflow-hidden px-[40px] py-[32px] mb-8">
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePreviousWeek}
              className="font-medium text-[48px]"
            >
              «
            </button>

            <WeekSelector
              currentDate={currentDate}
              onDateChange={(date) => {}}
            />

            <button
              onClick={handleNextWeek}
              className="font-medium text-[48px]"
            >
              »
            </button>
          </div>

          <OrderStatusLegend />
        </div>

        <div className="w-full">
          <div className="grid grid-cols-7 gap-0">
            {weekDays.map((day) => (
              <div
                key={format(day, "yyyy-MM-dd")}
                className="py-2 text-[14px] font-normal text-[#333333] text-start w-full"
              >
                {t(format(day, "EEEE"))}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0">
            {weekDays.map((day) => {
              const dayOrders = groupedOrders[format(day, "yyyy-MM-dd")] || [];
              return (
                <OrderDayCell
                  key={format(day, "yyyy-MM-dd")}
                  date={day}
                  orders={dayOrders}
                  allOrders={orders}
                  selectedOrders={selectedOrders}
                  onOrdersChange={setOrders}
                  onOrderClick={handleOrderClick}
                  onOrderSelect={handleOrderSelect}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  draggedOrder={draggedOrder}
                  onDeleteOrder={handleDeleteOrder}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

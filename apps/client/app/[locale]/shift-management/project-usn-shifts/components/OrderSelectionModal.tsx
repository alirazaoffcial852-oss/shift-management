"use client";

import React, { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { format } from "date-fns";
import { Order } from "@/types/order";
import { useOrderCalendar } from "@/hooks/order/useOrderCalendar";
import { OrderDayCell } from "@/components/OrderCalendar/OrderDayCell";
import { groupOrdersByDate, WEEKDAYS } from "@/utils/orderCalendar";
import MonthYearSelector from "@/components/OrderCalendar/MonthYearSelector";
import OrderStatusLegend from "@/components/OrderCalendar/OrderStatusLegend";
import { useTranslations } from "next-intl";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import LoadingSpinner from "@/components/LoadingSpinner";

interface OrderSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder: (order: Order) => void;
  selectedOrderId?: string;
}

export const OrderSelectionModal: React.FC<OrderSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectOrder,
  selectedOrderId,
}) => {
  const tCalendarDays = useTranslations("pages.calandar.days");
  const tOrder = useTranslations("pages.order");
  const t = useTranslations("pages.shift.orderSelection");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const {
    currentDate,
    totalDays,
    skipDays,
    orders,
    handlePreviousMonth,
    handleNextMonth,
    handleMonthYearSelect,
    isLoading,
    fetchOrders,
  } = useOrderCalendar("monthly");

  const groupedOrders = groupOrdersByDate(orders || []);

  // Fetch orders when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, fetchOrders]);

  // Reset selected order when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedOrder(null);
    }
  }, [isOpen]);

  const handleOrderClick = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleOrderSelect = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleConfirm = () => {
    if (selectedOrder) {
      onSelectOrder(selectedOrder);
      onClose();
      setSelectedOrder(null);
    }
  };

  const handleCancel = () => {
    setSelectedOrder(null);
    onClose();
  };

  const onDateChange = (year: number, month: number) => {
    if (handleMonthYearSelect) {
      handleMonthYearSelect(year, month);
    }
  };

  const totalCells = skipDays.length + totalDays.length;
  const numberOfWeeks = Math.ceil(totalCells / 7);

  const weeks = [];
  for (let week = 0; week < numberOfWeeks; week++) {
    const weekCells = [];

    for (let day = 0; day < 7; day++) {
      const cellIndex = week * 7 + day;

      if (cellIndex < skipDays.length) {
        weekCells.push(
          <div
            key={`empty-${cellIndex}`}
            className="border border-dashed border-[#E0E0E0] min-h-[120px] w-full"
          ></div>
        );
      } else if (cellIndex < totalCells) {
        const dayIndex = cellIndex - skipDays.length;
        if (dayIndex < totalDays.length) {
          const dayNumber = totalDays[dayIndex];
          const date = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayNumber
          );
          const dayOrders = groupedOrders[format(date, "yyyy-MM-dd")] || [];

          weekCells.push(
            <OrderDayCell
              key={`day-${dayNumber}`}
              date={date}
              orders={dayOrders}
              allOrders={orders || []}
              selectedOrders={selectedOrder ? [selectedOrder] : []}
              onOrdersChange={() => {}}
              onOrderClick={handleOrderClick}
              onOrderSelect={handleOrderSelect}
              onDragStart={undefined}
              onDragEnd={undefined}
              onDrop={undefined}
              draggedOrder={null}
              onDeleteOrder={undefined}
            />
          );
        }
      } else {
        weekCells.push(
          <div
            key={`future-empty-${cellIndex}`}
            className="border border-dashed border-[#E0E0E0] min-h-[120px] w-full"
          ></div>
        );
      }
    }

    weeks.push(
      <div key={`week-${week}`} className="grid grid-cols-7 gap-0">
        {weekCells}
      </div>
    );
  }

  // Set initial selected order if selectedOrderId is provided
  React.useEffect(() => {
    if (isOpen && selectedOrderId && orders && orders.length > 0) {
      const order = orders.find((o) => o.id.toString() === selectedOrderId);
      if (order && !selectedOrder) {
        setSelectedOrder(order);
      }
    }
  }, [isOpen, selectedOrderId, orders, selectedOrder]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text={tOrder("loadingOrders")} />
          </div>
        ) : (
          <div className="w-full">
            <div className="py-2 flex justify-between items-center mb-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handlePreviousMonth}
                  className="font-medium text-[32px] hover:opacity-70"
                  type="button"
                >
                  «
                </button>

                <MonthYearSelector
                  currentDate={currentDate}
                  onDateChange={onDateChange}
                />

                <button
                  onClick={handleNextMonth}
                  className="font-medium text-[32px] hover:opacity-70"
                  type="button"
                >
                  »
                </button>
              </div>

              <OrderStatusLegend />
            </div>

            {selectedOrder && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  {t("selectedOrderSummary", {
                    orderId: selectedOrder.id,
                    wagonType: selectedOrder.type_of_wagon || "",
                    wagons: selectedOrder.no_of_wagons ?? 0,
                    tonnage: selectedOrder.tonnage ?? 0,
                  })}
                </p>
                {selectedOrder.return_schedule && (
                  <p className="text-xs text-blue-700 mt-1">
                    {t("returnSchedule", {
                      date: format(new Date(selectedOrder.return_schedule), "dd/MM/yyyy"),
                    })}
                  </p>
                )}
              </div>
            )}

            <div className="w-full">
              <div className="grid grid-cols-7 gap-0">
                {WEEKDAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2 text-[14px] font-normal text-[#333333] text-start w-full"
                  >
                    {tCalendarDays(day)}
                  </div>
                ))}
              </div>

              {weeks}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <SMSButton
                text={t("cancel")}
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full"
                type="button"
              />
              <SMSButton
                text={t("confirmSelection")}
                onClick={handleConfirm}
                disabled={!selectedOrder}
                className="bg-[#3E8258] hover:bg-[#3E8258]/90 text-white px-6 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};


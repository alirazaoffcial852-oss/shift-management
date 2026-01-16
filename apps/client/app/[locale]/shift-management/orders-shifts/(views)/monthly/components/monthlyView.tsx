"use client";
import Calendar from "./calendar";
import { useOrderCalendar } from "@/hooks/order/useOrderCalendar";
import OrderActions from "@/components/OrderActions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useTranslations } from "next-intl";

export default function MonthlyView() {
  const t = useTranslations("pages.order");
  const {
    currentDate,
    currentMonth,
    totalDays,
    skipDays,
    selectedOrders,
    orders,
    setOrders,
    handlePreviousMonth,
    handleNextMonth,
    handleOrderClick,
    handleOrderSelect,
    handleMonthYearSelect,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDeleteOrder,
    draggedOrder,
    fetchOrders,
    isLoading,
  } = useOrderCalendar("monthly");

  const handleImportSuccess = () => {
    fetchOrders();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text={t("loadingOrders")} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <OrderActions
          selectedOrdersCount={selectedOrders.length}
          selectedOrders={selectedOrders}
          onImportSuccess={handleImportSuccess}
        />
      </div>
      <Calendar
        orders={orders}
        selectedOrders={selectedOrders}
        onOrderSelect={(order) => handleOrderSelect(order)}
        onOrdersChange={setOrders}
        currentMonth={currentMonth}
        totalDays={totalDays}
        skipDays={skipDays}
        currentDate={currentDate}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
        handleOrderClick={handleOrderClick}
        handleMonthYearSelect={handleMonthYearSelect}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        draggedOrder={draggedOrder}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
}

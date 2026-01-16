"use client";
import Calendar from "./calendar";
import { useProjectUSNCalendar } from "@/hooks/projectUsnShifts/useProjectUSNCalendar";
import UsnShiftsActions from "@/components/UsnShiftsActions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";

export default function MonthlyView() {
  const {
    currentDate,
    currentMonth,
    totalDays,
    skipDays,
    selectedShifts,
    shifts,
    setShifts,
    handlePreviousMonth,
    handleNextMonth,
    handleShiftClick,
    handleShiftSelect,
    handleMonthYearSelect,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDeleteShift,
    handleFixedShifts,
    handlePlannedShifts,
    handleTimeSheet,
    handleHandoverBook,
    draggedShift,
    isLoading,
  } = useProjectUSNCalendar("monthly", "usn");

  const { locomotives } = useLocomotiveTable();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading USN shifts..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <UsnShiftsActions selectedShiftsCount={selectedShifts.length} />
      </div>
      <Calendar
        shifts={shifts}
        selectedShifts={selectedShifts}
        onShiftSelect={(shift) => handleShiftSelect(shift)}
        onShiftsChange={setShifts}
        currentMonth={currentMonth}
        totalDays={totalDays}
        skipDays={skipDays}
        currentDate={currentDate}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
        handleShiftClick={handleShiftClick}
        handleMonthYearSelect={handleMonthYearSelect}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        draggedShift={draggedShift}
        onDeleteShift={handleDeleteShift}
        handleFixedShifts={handleFixedShifts}
        handlePlannedShifts={handlePlannedShifts}
        handleTimeSheet={handleTimeSheet}
        handleHandoverBook={handleHandoverBook}
        locomotives={locomotives}
      />
    </div>
  );
}

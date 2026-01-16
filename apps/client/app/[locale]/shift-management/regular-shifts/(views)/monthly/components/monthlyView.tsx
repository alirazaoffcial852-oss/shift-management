"use client";
import CalendarActions from "@/components/Calendar/CalendarActions";
import Calendar from "./calendar";
import { useShift } from "@/providers/shiftProvider";
import { useCalendar } from "@/hooks/shift/useCalendar";

export default function MonthlyView() {
  const { data } = useShift();
  const { selectedShifts } = data;
  const {
    currentMonth,
    totalDays,
    skipDays,
    currentDate,
    handlePreviousMonth,
    handleNextMonth,
    handleShiftClick,
    setGlobalShifts,
    globalShifts,
    setSelectedShifts,
    handleMonthYearSelect,
  } = useCalendar("monthly");

  const filterShifts = globalShifts.filter((shift) => shift.status !== "DRAFT");

  return (
    <div className="w-full">
      <div className="mb-6">
        <CalendarActions
          selectedShiftsCount={selectedShifts.global.length}
          selectedShifts={selectedShifts.global}
        />
      </div>

      <Calendar
        shifts={filterShifts}
        selectedShifts={selectedShifts.global}
        onShiftSelect={(shift) => setSelectedShifts("global", [shift])}
        onShiftsChange={setGlobalShifts}
        currentMonth={currentMonth}
        totalDays={totalDays}
        skipDays={skipDays}
        currentDate={currentDate}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
        handleShiftClick={handleShiftClick}
        handleMonthYearSelect={handleMonthYearSelect}
      />
    </div>
  );
}

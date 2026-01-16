"use client";
import { format } from "date-fns";
import { DayCell } from "@/components/Calendar/DayCell";
import { groupShiftsByDate, WEEKDAYS } from "@/utils/calendar";
import { Shift } from "@/types/shift";
import StatusLegend from "@/components/Calendar/StatusLegend";
import { useProductTable } from "@/hooks/product/useProductTable";
import MonthYearSelector from "@/components/Calendar/MonthYearSelector";
import { useTranslations } from "next-intl";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";

interface CalendarProps {
  shifts: Shift[];
  selectedShifts: Shift[];
  onShiftSelect: (shift: Shift) => void;
  onShiftsChange: (shifts: Shift[]) => void;
  currentMonth: string;
  totalDays: number[];
  skipDays: number[];
  currentDate: Date;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  handleShiftClick: (shift: Shift) => void;
  handleMonthYearSelect?: (year: number, month: number) => void;
}

export default function Calendar({
  shifts,
  selectedShifts,
  onShiftSelect,
  onShiftsChange,
  currentMonth,
  totalDays,
  skipDays,
  currentDate,
  handlePreviousMonth,
  handleNextMonth,
  handleShiftClick,
  handleMonthYearSelect,
}: CalendarProps) {
  const groupedShifts = groupShiftsByDate(shifts || []);
  const { products } = useProductTable();
  const { locomotives } = useLocomotiveTable();

  const t = useTranslations("pages.calandar.days");

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
          const dayShifts = groupedShifts[format(date, "yyyy-MM-dd")] || [];

          weekCells.push(
            <DayCell
              key={`day-${dayNumber}`}
              date={date}
              shifts={dayShifts}
              allShifts={shifts}
              selectedShifts={selectedShifts}
              onShiftsChange={onShiftsChange}
              onShiftClick={handleShiftClick}
              onShiftSelect={(shift: Shift) => onShiftSelect(shift)}
              products={products}
              locomotives={locomotives}
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

  return (
    <div className="w-full max-w-full bg-white shadow-md rounded-[32px] overflow-hidden px-[40px] py-[32px] mb-8 ">
      <div className="py-2 flex justify-between items-center">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handlePreviousMonth}
            className="font-medium text-[48px]"
          >
            «
          </button>

          {handleMonthYearSelect ? (
            <MonthYearSelector
              currentDate={currentDate}
              onDateChange={onDateChange}
            />
          ) : (
            <span className="text-[30px] font-bold text-center min-w-[300px]">
              {currentMonth.toUpperCase()}
            </span>
          )}

          <button onClick={handleNextMonth} className="font-medium text-[48px]">
            »
          </button>
        </div>

        <StatusLegend />
      </div>

      <div className="w-full">
        <div className="grid grid-cols-7 gap-0">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-[14px] font-normal text-[#333333] text-start w-full"
            >
              {t(day)}
            </div>
          ))}
        </div>

        {weeks}
      </div>
    </div>
  );
}

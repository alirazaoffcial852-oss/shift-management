"use client";
import { format } from "date-fns";
import { ProjectUSNShift } from "@/types/projectUsn";
import MonthYearSelector from "@/components/OrderCalendar/MonthYearSelector";
import { useTranslations } from "next-intl";
import { ProjectUSNShiftDayCell } from "@/components/ProjectUSNCalendar/ProjectUSNShiftDayCell";
import { groupShiftsByDate, WEEKDAYS } from "@/utils/projectUsnCalendar";
import UsnShiftStatusLegend from "@/components/ProjectUSNCalendar/UsnShiftStatusLegend";

interface CalendarProps {
  shifts: ProjectUSNShift[];
  selectedShifts: ProjectUSNShift[];
  onShiftSelect: (shift: ProjectUSNShift) => void;
  onShiftsChange: (shifts: ProjectUSNShift[]) => void;
  currentMonth: string;
  totalDays: number[];
  skipDays: number[];
  currentDate: Date;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
  handleShiftClick: (shift: ProjectUSNShift) => void;
  handleMonthYearSelect?: (year: number, month: number) => void;
  onDragStart?: (shift: ProjectUSNShift) => void;
  onDragEnd?: () => void;
  onDrop?: (date: Date) => void;
  draggedShift?: ProjectUSNShift | null;
  onDeleteShift?: (shiftId: number) => void;
  handleFixedShifts?: (shifts: ProjectUSNShift[]) => Promise<boolean>;
  handlePlannedShifts?: (shifts: ProjectUSNShift[]) => Promise<boolean>;
  handleTimeSheet?: (shifts: ProjectUSNShift[]) => void;
  handleHandoverBook?: (shifts: ProjectUSNShift[]) => void;
  locomotives?: any[];
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
  onDragStart,
  onDragEnd,
  onDrop,
  draggedShift,
  onDeleteShift,
  handleFixedShifts,
  handlePlannedShifts,
  handleTimeSheet,
  handleHandoverBook,
  locomotives = [],
}: CalendarProps) {
  const groupedShifts = groupShiftsByDate(shifts || []);

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
            <ProjectUSNShiftDayCell
              key={`day-${dayNumber}`}
              date={date}
              shifts={dayShifts}
              allShifts={shifts}
              selectedShifts={selectedShifts}
              onShiftsChange={onShiftsChange}
              onShiftClick={handleShiftClick}
              onShiftSelect={(shift: ProjectUSNShift) => onShiftSelect(shift)}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
              draggedShift={draggedShift}
              onDeleteShift={onDeleteShift}
              handleFixedShifts={handleFixedShifts}
              handlePlannedShifts={handlePlannedShifts}
              handleTimeSheet={handleTimeSheet}
              handleHandoverBook={handleHandoverBook}
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
        <div className="flex items-center justify-center">
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

        <UsnShiftStatusLegend />
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

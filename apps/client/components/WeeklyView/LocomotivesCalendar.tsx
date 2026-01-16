import React from "react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { DayCell } from "@/components/Calendar/DayCell";
import { Shift } from "@/types/shift";
import { Locomotive } from "@/types/locomotive";
import { groupShiftsByDate } from "@/utils/calendar";
import StatusLegend from "../Calendar/StatusLegend";
import WeekSelector from "../Calendar/WeekSelector";
import { useTranslations } from "next-intl";

interface LocomotivesCalendarProps {
  locomotives: Locomotive[];
  currentDate: Date;
  weekDays: Date[];
  shifts: Shift[];
  allShifts: Shift[];
  selectedShifts: Shift[];
  onDateChange: (date: Date) => void;
  onShiftClick: (shift: Shift) => void;
  onShiftSelect: (shift: Shift) => void;
  onShiftsChange: (shifts: Shift[]) => void;
  products: any[];
}

export const LocomotivesCalendar: React.FC<LocomotivesCalendarProps> = ({
  locomotives,
  currentDate,
  weekDays,
  shifts,
  allShifts,
  selectedShifts,
  onDateChange,
  onShiftClick,
  onShiftSelect,
  onShiftsChange,
  products,
}) => {
  const groupedShifts = groupShiftsByDate(shifts);
  const t = useTranslations("pages.calandar.days");
  const getLocomotiveShifts = (date: Date, locomotiveId: number | null = null) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayShifts = groupedShifts[dateKey] || [];

    if (locomotiveId === null) {
      return dayShifts.filter((shift: Shift) => shift?.shiftDetail?.has_locomotive && !shift.locomotive_id);
    }

    return dayShifts.filter((shift) => shift.locomotive_id !== undefined && Number(shift.locomotive_id) === locomotiveId);
  };

  const handlePreviousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };
  return (
    <div className="w-full max-w-full bg-white shadow-2xl rounded-[32px] overflow-x-auto px-[60px] py-[32px]">
      {/* Calendar Header */}
      <div className="py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button onClick={handlePreviousWeek} className="font-medium text-[48px]">
            «
          </button>
          <WeekSelector currentDate={currentDate} onDateChange={onDateChange} />
          <button onClick={handleNextWeek} className="font-medium text-[48px]">
            »
          </button>
        </div>
        <StatusLegend />
      </div>

      {/* Calendar Body */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left min-w-[200px]">Locomotives</th>
            {weekDays.map((date) => (
              <th key={format(date, "yyyy-MM-dd")} className="p-2">
                {t(format(date, "EEEE"))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Open Shifts Row */}
          <tr className="border-b hover:bg-gray-50 overflow-x-auto">
            <td className="p-4 font-medium">Open Locomotive Shifts</td>
            {weekDays.map((date) => (
              <td key={format(date, "yyyy-MM-dd")} className="p-0 border">
                <DayCell
                  date={date}
                  shifts={getLocomotiveShifts(date, null)}
                  allShifts={allShifts}
                  selectedShifts={selectedShifts}
                  onShiftClick={onShiftClick}
                  onShiftSelect={onShiftSelect}
                  onShiftsChange={onShiftsChange}
                  products={products}
                  locomotiveId={null}
                  isLocomotiveCell={true}
                  locomotives={locomotives}
                />
              </td>
            ))}
          </tr>

          {/* Assigned Locomotives */}
          {locomotives.map((locomotive) => (
            <tr key={locomotive.id} className="border-b hover:bg-gray-50 overflow-x-auto">
              <td className="p-4">{locomotive.name}</td>
              {weekDays.map((date) => (
                <td key={format(date, "yyyy-MM-dd")} className="p-0 border">
                  <DayCell
                    date={date}
                    shifts={getLocomotiveShifts(date, locomotive.id ?? 0)}
                    allShifts={allShifts}
                    selectedShifts={selectedShifts}
                    onShiftClick={onShiftClick}
                    onShiftSelect={onShiftSelect}
                    onShiftsChange={onShiftsChange}
                    products={products}
                    locomotiveId={locomotive.id ?? null}
                    isLocomotiveCell={true}
                    locomotives={locomotives}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

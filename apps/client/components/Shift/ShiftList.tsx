"use client";
import React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Shift } from "@/types/shift";

interface ShiftsListProps {
  selectedShifts: Shift[];
  selectedShiftIndex: number;
  switchSelectedShift: (index: number) => void;
}
const safeFormatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return "N/A";

  const trimmed = timeString.toString().trim();

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return trimmed.substring(0, 5);
  }

  try {
    const date = parseISO(trimmed);
    if (isValid(date)) {
      return format(date, "HH:mm");
    }
    const dateObj = new Date(trimmed);
    if (isValid(dateObj)) {
      return format(dateObj, "HH:mm");
    }
    return "N/A";
  } catch (e) {
    try {
      const dateObj = new Date(trimmed);
      if (isValid(dateObj)) {
        return format(dateObj, "HH:mm");
      }
      return "N/A";
    } catch (error) {
      return "N/A";
    }
  }
};
const ShiftsList: React.FC<ShiftsListProps> = ({
  selectedShifts,
  selectedShiftIndex,
  switchSelectedShift,
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {selectedShifts?.map((shift: Shift, index: number) => (
        <div
          key={shift.id}
          onClick={() => switchSelectedShift(index)}
          className={`relative py-4 rounded-md p-2 cursor-pointer hover:opacity-90 transition-all bg-white shadow text-xs text-[#000000] font-medium`}
          style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
        >
          <div className="flex-1">
            <div className="flex">
              {`${safeFormatTime(shift?.start_time)} - ${safeFormatTime(shift?.end_time)}`}{" "}
              {shift.date ? format(parseISO(shift?.date), "yyyy-MM-dd") : "N/A"}
            </div>

            <div>Customer: {shift.customer?.name || ""}</div>

            {shift.project && <div>Project: {shift.project.name}</div>}

            {selectedShiftIndex === index && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3E8258] shadow-lg rounded-b-md"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShiftsList;

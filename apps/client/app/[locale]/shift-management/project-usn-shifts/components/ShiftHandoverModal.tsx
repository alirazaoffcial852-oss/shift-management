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
import { ProjectUSNShift } from "@/types/projectUsn";
import { useProjectUSNCalendar } from "@/hooks/projectUsnShifts/useProjectUSNCalendar";
import { ProjectUSNShiftDayCell } from "@/components/ProjectUSNCalendar/ProjectUSNShiftDayCell";
import { groupShiftsByDate, WEEKDAYS } from "@/utils/projectUsnCalendar";
import MonthYearSelector from "@/components/OrderCalendar/MonthYearSelector";
import { useTranslations } from "next-intl";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ShiftHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShift: (shift: ProjectUSNShift) => void;
}

export const ShiftHandoverModal: React.FC<ShiftHandoverModalProps> = ({
  isOpen,
  onClose,
  onSelectShift,
}) => {
  const tDays = useTranslations("pages.calandar.days");
  const t = useTranslations("pages.projectUsn.shiftHandover");
  const [selectedShift, setSelectedShift] = useState<ProjectUSNShift | null>(
    null
  );

  const {
    currentDate,
    totalDays,
    skipDays,
    shifts,
    handlePreviousMonth,
    handleNextMonth,
    handleMonthYearSelect,
    isLoading,
  } = useProjectUSNCalendar("monthly", "usn");

  const { locomotives } = useLocomotiveTable();

  const groupedShifts = groupShiftsByDate(shifts || []);

  const handleShiftClick = useCallback((shift: ProjectUSNShift) => {
    setSelectedShift(shift);
  }, []);

  const handleConfirm = () => {
    if (selectedShift) {
      onSelectShift(selectedShift);
      onClose();
      setSelectedShift(null);
    }
  };

  const handleCancel = () => {
    setSelectedShift(null);
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
          const dayShifts = groupedShifts[format(date, "yyyy-MM-dd")] || [];

          weekCells.push(
            <ProjectUSNShiftDayCell
              key={`day-${dayNumber}`}
              date={date}
              shifts={dayShifts}
              allShifts={shifts}
              selectedShifts={selectedShift ? [selectedShift] : []}
              onShiftsChange={() => {}}
              onShiftClick={handleShiftClick}
              onShiftSelect={handleShiftClick}
              onDragStart={undefined}
              onDragEnd={undefined}
              onDrop={undefined}
              draggedShift={null}
              onDeleteShift={undefined}
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text={t("loading")} />
          </div>
        ) : (
          <div className="w-full">
            <div className="py-2 flex justify-between items-center mb-4">
              <div className="flex items-center justify-center">
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
            </div>

            {selectedShift && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  {t("selectedShift", {
                    date: format(new Date(selectedShift.date), "PPP"),
                    start: selectedShift.start_time,
                    end: selectedShift.end_time,
                  })}
                </p>
                {Array.isArray(selectedShift.usn_shift_route_planning) &&
                  selectedShift.usn_shift_route_planning.length > 0 && (
                    <p className="text-xs text-blue-700 mt-1">
                      {t("selectedShiftHint")}
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
                    {tDays(day)}
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
                text={t("confirm")}
                onClick={handleConfirm}
                disabled={!selectedShift}
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

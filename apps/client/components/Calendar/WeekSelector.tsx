"use client";
import { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  getWeeksInMonth,
  getWeek,
  setWeek,
} from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface WeekSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function WeekSelector({
  currentDate,
  onDateChange,
}: WeekSelectorProps) {
  const tShift = useTranslations("pages.shift");
  const tMonths = useTranslations("pages.calandar.months");

  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    return getWeek(firstDayOfWeek, { weekStartsOn: 1 });
  });

  useEffect(() => {
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth());
    const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    setSelectedWeek(getWeek(firstDayOfWeek, { weekStartsOn: 1 }));
  }, [currentDate]);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const currentYear = new Date().getFullYear();
  const today = new Date();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  const getWeeksForMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const weeksInMonth = getWeeksInMonth(date, { weekStartsOn: 1 });
    const firstWeek = getWeek(date, { weekStartsOn: 1 });

    return Array.from({ length: weeksInMonth }, (_, i) => {
      const weekNum = ((firstWeek + i - 1) % 52) + 1;
      const weekStart = startOfWeek(
        setWeek(new Date(year, month, 1), weekNum, { weekStartsOn: 1 }),
        { weekStartsOn: 1 }
      );
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      return {
        weekNum,
        label: `${tShift("week")} ${weekNum}: ${format(
          weekStart,
          "MMM d"
        )} - ${format(weekEnd, "MMM d")}`,
        startDate: weekStart,
      };
    });
  };

  const weeks = getWeeksForMonth(selectedYear, selectedMonth);

  const handleSelect = (date: Date) => {
    onDateChange(date);
    setOpen(false);
  };

  const handleGoToCurrentWeek = () => {
    onDateChange(today);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="px-3 py-2 bg-white rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <span className="px-2 text-[18px] font-bold">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d")}
          </span>
          <ChevronDown className="h-5 w-5 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4"
        align="center"
        side="bottom"
        sideOffset={5}
        avoidCollisions={false}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">{tShift("select_week")}</h3>
            <button
              onClick={handleGoToCurrentWeek}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{tShift("current_week")}</span>
            </button>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                {tShift("year")}
              </label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                {tShift("month")}
              </label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={index}>
                    {tMonths(
                      new Date(2000, index, 1).toLocaleString("en", {
                        month: "long",
                      })
                    )}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {tShift("week")}
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {weeks.map((week) => (
                <button
                  key={week.weekNum}
                  onClick={() => handleSelect(week.startDate)}
                  className="py-2 px-3 text-left rounded-md text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <span className="font-medium">{week.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleGoToCurrentWeek}
              className="flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200 flex-1"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{tShift("current_week")}</span>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

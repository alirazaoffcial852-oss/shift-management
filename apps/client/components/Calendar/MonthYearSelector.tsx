"use client";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface MonthYearSelectorProps {
  currentDate: Date;
  onDateChange: (year: number, month: number) => void;
}

export default function MonthYearSelector({
  currentDate,
  onDateChange,
}: MonthYearSelectorProps) {
  const tMonths = useTranslations("pages.calandar.months");
  const tCommon = useTranslations("pages.shift");

  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());

  useEffect(() => {
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth());
  }, [currentDate]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleSelect = (year: number, month: number) => {
    onDateChange(year, month);
    setOpen(false);
  };

  const handleGoToToday = () => {
    onDateChange(currentYear, currentMonth);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="bg-white rounded-lg flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <div className="text-[30px] font-bold min-w-[300px] flex gap-4 justify-center">
            <span>
              {tMonths(
                currentDate.toLocaleDateString("en-US", {
                  month: "long",
                })
              )}
            </span>
            <span>
              {" "}
              {currentDate
                .toLocaleDateString("en-US", {
                  year: "numeric",
                })
                .toUpperCase()}
            </span>
          </div>
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
            <h3 className="text-sm font-medium">
              {tCommon("selectMonthYear")}
            </h3>
            <button
              onClick={handleGoToToday}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>{tCommon("today")}</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {tCommon("year")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`py-2 rounded-md text-sm ${
                    selectedYear === year
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {tCommon("month")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((month, index) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`py-2 rounded-md text-sm ${
                    selectedMonth === index
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {tMonths(month).substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSelect(selectedYear, selectedMonth)}
              className="flex-1 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200"
            >
              {tCommon("apply")}
            </button>
            <button
              onClick={handleGoToToday}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              {tCommon("today")}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

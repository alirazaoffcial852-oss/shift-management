"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Search } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

interface TableFiltersProps {
  onSearchChange?: (value: string) => void;
  dateFilter?: boolean;
  onDateRangeChange?: (value: string) => void;
  searchPlaceholder?: string;
  additionalFilters?: ReactNode;
  className?: string;
}

export const SearchFilters = ({
  onSearchChange,
  onDateRangeChange,
  searchPlaceholder = "Type here to search",
  additionalFilters,
  className = "",
  dateFilter,
}: TableFiltersProps) => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2024, 5, 28),
    to: new Date(2024, 8, 30),
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const formattedRange =
    range?.from && range?.to
      ? `${format(range.from, "dd MMM yyyy")} - ${format(range.to, "dd MMM yyyy")}`
      : "Select date range";

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${className}`}
    >
      <div className="w-full md:w-[300px]">
        <SMSInput
          placeholder={searchPlaceholder}
          startIcon={<Search className="w-4 h-4" />}
          className="w-full"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      {dateFilter && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 relative z-50">
          <div className="relative w-full md:w-[250px]" ref={calendarRef}>
            <button
              type="button"
              className="w-full rounded-full h-10 px-4 border text-left bg-white shadow-sm"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {formattedRange}
            </button>

            {showCalendar && (
              <div className="absolute mt-2 bg-white border rounded-md shadow-md p-4 right-1">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={(selectedRange) => {
                    setRange(selectedRange);
                    if (selectedRange?.from && selectedRange?.to) {
                      onDateRangeChange?.(
                        `${selectedRange.from.toISOString()}|${selectedRange.to.toISOString()}`
                      );
                      setShowCalendar(false);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {additionalFilters}
        </div>
      )}
    </div>
  );
};

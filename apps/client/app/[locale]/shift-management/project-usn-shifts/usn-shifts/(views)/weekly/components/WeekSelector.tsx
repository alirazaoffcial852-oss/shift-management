"use client";
import React, { useState } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { ChevronDown } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface WeekSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function WeekSelector({
  currentDate,
  onDateChange,
}: WeekSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const currentYear = currentDate.getFullYear();
  const currentWeek = Math.ceil(
    ((currentDate.getTime() - new Date(currentYear, 0, 1).getTime()) /
      86400000 +
      1) /
      7
  );

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  const handleWeekYearSelect = (year: number, week: number) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const firstMonday = new Date(firstDayOfYear);
    const dayOfWeek = firstDayOfYear.getDay();
    const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
    firstMonday.setDate(firstDayOfYear.getDate() + daysToMonday);

    const targetDate = new Date(firstMonday);
    targetDate.setDate(firstMonday.getDate() + (week - 1) * 7);

    onDateChange(targetDate);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 text-[30px] font-bold text-center min-w-[200px] hover:bg-gray-50 rounded px-2 py-1">
          <span>
            {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd")}
          </span>
          <ChevronDown className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-80">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Year</h3>
              <div className="max-h-40 overflow-y-auto">
                {years.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => handleWeekYearSelect(year, currentWeek)}
                    className={cn(
                      "cursor-pointer",
                      year === currentYear && "bg-blue-100"
                    )}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Week</h3>
              <div className="max-h-40 overflow-y-auto">
                {weeks.map((week) => (
                  <DropdownMenuItem
                    key={week}
                    onClick={() => handleWeekYearSelect(currentYear, week)}
                    className={cn(
                      "cursor-pointer",
                      week === currentWeek && "bg-blue-100"
                    )}
                  >
                    Week {week}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

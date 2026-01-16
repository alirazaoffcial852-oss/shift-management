import React, { useState } from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface MonthYearSelectorProps {
  currentDate: Date;
  onDateChange: (year: number, month: number) => void;
}

const MonthYearSelector = ({
  currentDate,
  onDateChange,
}: MonthYearSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const months = [
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

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleMonthYearSelect = (year: number, month: number) => {
    onDateChange(year, month);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 text-[30px] font-bold text-center min-w-[250px] hover:bg-gray-50 rounded px-2 py-1">
          <span>{format(currentDate, "MMMM yyyy").toUpperCase()}</span>
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
                    onClick={() => handleMonthYearSelect(year, currentMonth)}
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
              <h3 className="font-semibold mb-2">Month</h3>
              <div className="max-h-40 overflow-y-auto">
                {months.map((month, index) => (
                  <DropdownMenuItem
                    key={month}
                    onClick={() => handleMonthYearSelect(currentYear, index)}
                    className={cn(
                      "cursor-pointer",
                      index === currentMonth && "bg-blue-100"
                    )}
                  >
                    {month}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MonthYearSelector;

// components/TableFilters/index.tsx
"use client";

import { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Search } from "lucide-react";

interface TimeFilterOption {
  value: string;
  label: string;
}

interface DateRangeOption {
  value: string;
  label: string;
}

interface TableFiltersProps {
  onSearchChange?: (value: string) => void;
  timeFilterOptions?: TimeFilterOption[];
  dateRangeOptions?: DateRangeOption[];
  defaultTimeFilter?: string;
  defaultDateRange?: string;
  onTimeFilterChange?: (value: string) => void;
  onDateRangeChange?: (value: string) => void;
  searchPlaceholder?: string;
  additionalFilters?: ReactNode;
  className?: string;
}

export const TableFilters = ({
  onSearchChange,
  timeFilterOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "daily", label: "Daily" },
  ],
  dateRangeOptions = [
    { value: "date-range", label: "28 June 2024 - 30 Sep 2024" },
    { value: "previous", label: "Previous Period" },
  ],
  defaultTimeFilter = "monthly",
  defaultDateRange = "date-range",
  onTimeFilterChange,
  onDateRangeChange,
  searchPlaceholder = "Type here to search",
  additionalFilters,
  className = "",
}: TableFiltersProps) => {
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

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <Select
          defaultValue={defaultTimeFilter}
          onValueChange={onTimeFilterChange}
        >
          <SelectTrigger className="w-full md:w-[120px] rounded-full h-10">
            <SelectValue placeholder="Monthly" />
          </SelectTrigger>
          <SelectContent>
            {timeFilterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={defaultDateRange}
          onValueChange={onDateRangeChange}
        >
          <SelectTrigger className="w-full md:w-[200px] rounded-full h-10">
            <SelectValue placeholder="28 June 2024 - 30 Sep 2024" />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {additionalFilters}
      </div>
    </div>
  );
};

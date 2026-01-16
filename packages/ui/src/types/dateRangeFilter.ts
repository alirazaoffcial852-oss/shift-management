import { ReactNode } from "react";

export interface TimeFilterOption {
  value: string;
  label: string;
}

export interface DateRangeOption {
  value: string;
  label: string;
}

// DateTimeFilter Component
export interface DateTimeFilterProps {
  timeFilterOptions?: TimeFilterOption[];
  dateRangeOptions?: DateRangeOption[];
  defaultTimeFilter?: string;
  defaultDateRange?: string;
  onTimeFilterChange?: (value: string) => void;
  onDateRangeChange?: (value: string) => void;
  additionalFilters?: ReactNode;
  className?: string;
}

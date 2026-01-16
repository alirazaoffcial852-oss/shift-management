"use client";

import * as React from "react";
import { SearchFilters } from "@workspace/ui/components/custom/TableFilters";

interface FilterBarProps {
  onSearch?: (value: string) => void;
  onDateRange?: (value: string) => void;
  children?: React.ReactNode;
}

export default function FilterBar({ onSearch, onDateRange, children }: FilterBarProps) {
  return (
    <div className="px-5 pt-5">
      <SearchFilters
        onSearchChange={onSearch}
        onDateRangeChange={onDateRange}
        dateFilter
        className="mb-3"
      />
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}



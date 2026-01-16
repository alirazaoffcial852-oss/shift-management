"use client";
import { useState, useCallback } from "react";

export const useTableFilters = () => {
  const [tabValue, setTabValue] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");

  const handleSearch = useCallback((value: string) => {
    console.log("Searching:", value);
  }, []);

  const handleTimeFilterChange = useCallback((value: string) => {
    console.log("Time filter:", value);
  }, []);

  const handleDateRangeChange = useCallback((value: string) => {
    console.log("Date range:", value);
  }, []);

  return {
    tabValue,
    setTabValue,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
  };
};

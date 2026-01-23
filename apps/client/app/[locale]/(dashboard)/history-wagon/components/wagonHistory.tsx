"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { SearchInput } from "@workspace/ui/components/custom/SMSTable/SearchInput";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  useWagonHistory,
  WagonHistoryItem,
} from "@/hooks/wagon/useWagonHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { SMSDatePicker } from "@workspace/ui/components/custom/SMSDatePicker";
import { Button } from "@workspace/ui/components/button";
import { X } from "lucide-react";
import WagonService from "@/services/wagon.service";
import { format } from "date-fns";
import { DateTimeFilter } from "@workspace/ui/components/custom/SMSTable/DateTimeFilter";
import { useTranslations } from "next-intl";

interface WagonOption {
  id: number;
  wagon_number: number;
}

interface GroupedWagonHistory {
  wagon_id: number;
  wagon_number: number;
  currentStatus: string;
  currentLocation?: string;
  lastUpdated: string;
  history: WagonHistoryItem[];
}

const getStatusOptions = (t: (key: string) => string) => [
  { value: "all", label: t("allStatuses") },
  { value: "EMPTY", label: t("empty") },
  { value: "PLANNED_TO_BE_LOADED", label: t("plannedToBeLoaded") },
  { value: "SHOULD_BE_LOADED", label: t("shouldBeLoaded") },
  { value: "LOADED", label: t("loaded") },
  { value: "PLANNED_TO_BE_EMPTY", label: t("plannedToBeEmpty") },
  { value: "SHOULD_BE_EMPTY", label: t("shouldBeEmpty") },
  { value: "DAMAGED", label: t("damaged") },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "EMPTY":
      return "bg-gray-200 text-gray-700 border-gray-300";
    case "PLANNED_TO_BE_LOADED":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "SHOULD_BE_LOADED":
      return "bg-indigo-100 text-indigo-700 border-indigo-300";
    case "LOADED":
      return "bg-green-100 text-green-700 border-green-300";
    case "PLANNED_TO_BE_EMPTY":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "SHOULD_BE_EMPTY":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "DAMAGED":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-200 text-gray-700 border-gray-300";
  }
};

const formatStatus = (status: string, t: (key: string) => string) => {
  const statusMap: Record<string, string> = {
    EMPTY: t("empty"),
    PLANNED_TO_BE_LOADED: t("plannedToBeLoaded"),
    SHOULD_BE_LOADED: t("shouldBeLoaded"),
    LOADED: t("loaded"),
    PLANNED_TO_BE_EMPTY: t("plannedToBeEmpty"),
    SHOULD_BE_EMPTY: t("shouldBeEmpty"),
    DAMAGED: t("damaged"),
  };
  return (
    statusMap[status] ||
    status
      .split("_")
      .map((word) => word.toLowerCase())
      .join(" ")
  );
};

export default function WegonHistoryPage() {
  const t = useTranslations("pages.wagonHistory");
  const {
    history,
    currentPage,
    totalPages,
    total,
    isLoading,
    searchTerm,
    filters,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    clearFilters,
  } = useWagonHistory();

  const statusOptions = getStatusOptions(t);

  const [wagonOptions, setWagonOptions] = useState<WagonOption[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [loadingWagons, setLoadingWagons] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const fetchWagons = useCallback(async () => {
    try {
      setLoadingWagons(true);
      const response = await WagonService.getAllWagons(1, 1000);
      if (response.data?.data) {
        setWagonOptions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wagons:", error);
    } finally {
      setLoadingWagons(false);
    }
  }, []);

  useEffect(() => {
    fetchWagons();
  }, [fetchWagons]);

  const handleDateFromChange = useCallback(
    (date: Date | null) => {
      setDateFrom(date);
      if (date) {
        handleFilterChange({
          date_from: format(date, "yyyy-MM-dd"),
        });
      } else {
        handleFilterChange({ date_from: undefined });
      }
    },
    [handleFilterChange]
  );

  const handleDateToChange = useCallback(
    (date: Date | null) => {
      setDateTo(date);
      if (date) {
        handleFilterChange({
          date_to: format(date, "yyyy-MM-dd"),
        });
      } else {
        handleFilterChange({ date_to: undefined });
      }
    },
    [handleFilterChange]
  );

  const groupedHistory = useMemo(() => {
    const grouped: Record<number, GroupedWagonHistory> = {};

    history.forEach((item) => {
      const wagonId = item.wagon_id;
      const wagonNumber = item.wagon?.wagon_number || 0;

      if (!grouped[wagonId]) {
        grouped[wagonId] = {
          wagon_id: wagonId,
          wagon_number: wagonNumber,
          currentStatus: item.status,
          lastUpdated: item.date,
          history: [],
        };
      }

      grouped[wagonId].history.push(item);

      const itemDate = new Date(item.date);
      const currentDate = new Date(grouped[wagonId].lastUpdated);
      if (itemDate > currentDate) {
        grouped[wagonId].currentStatus = item.status;
        grouped[wagonId].lastUpdated = item.date;
      }
    });

    Object.values(grouped).forEach((group) => {
      group.history.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    });

    let filtered = Object.values(grouped);
    if (searchTerm) {
      filtered = filtered.filter((group) =>
        group.wagon_number.toString().includes(searchTerm)
      );
    }
    if (filters.wagon_id) {
      filtered = filtered.filter(
        (group) => group.wagon_id === filters.wagon_id
      );
    }
    if (filters.status) {
      filtered = filtered.filter((group) => {
        return group.history.some((item) => item.status === filters.status);
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.lastUpdated);
      const dateB = new Date(b.lastUpdated);
      return dateB.getTime() - dateA.getTime();
    });

    return filtered;
  }, [history, searchTerm, filters.wagon_id, filters.status]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setDateFrom(null);
    setDateTo(null);
    setSelectedDate("");
  }, [clearFilters]);

  const hasActiveFilters =
    filters.wagon_id ||
    filters.status ||
    filters.date_from ||
    filters.date_to ||
    searchTerm;

  return (
    <div className="px-6 py-8 max-w-[90rem] mx-auto">
      <h1 className="text-4xl font-medium mb-6">{t("wagonsHistory")}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className=" mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:w-[200px]">
                <Select
                  value={filters.wagon_id?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange({
                      wagon_id:
                        value && value !== "all" ? parseInt(value) : undefined,
                    })
                  }
                >
                  <SelectTrigger className="w-full rounded-full h-10">
                    <SelectValue placeholder={t("selectWagon")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allWagons")}</SelectItem>
                    {wagonOptions.map((wagon) => (
                      <SelectItem
                        key={wagon.id}
                        value={wagon.id.toString()}
                        className="text-sm"
                      >
                        {t("wagon")} {wagon.wagon_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-[200px]">
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    handleFilterChange({
                      status: value && value !== "all" ? value : undefined,
                    })
                  }
                >
                  <SelectTrigger className="w-full rounded-full h-10">
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full md:w-[200px] mt-1">
                <SMSDatePicker
                  label=""
                  placeholder={t("selectStartDate")}
                  value={{
                    startDate: dateFrom,
                    endDate: null,
                  }}
                  onChange={(value) =>
                    handleDateFromChange(value?.startDate ?? null)
                  }
                  useRange={false}
                  asSingle={true}
                  className="h-9"
                />
              </div>

              <div className="w-full md:w-[200px] mt-1">
                <SMSDatePicker
                  label=""
                  placeholder={t("selectEndDate")}
                  value={{
                    startDate: dateTo,
                    endDate: null,
                  }}
                  onChange={(value) =>
                    handleDateToChange(value?.startDate ?? null)
                  }
                  useRange={false}
                  asSingle={true}
                  className="h-9"
                />
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="rounded-full h-10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    {t("clearFilters")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">{t("loadingWagonHistory")}</p>
            </div>
          ) : groupedHistory.length > 0 ? (
            <Accordion type="multiple" className="space-y-4">
              {groupedHistory.map((group) => (
                <AccordionItem
                  key={group.wagon_id}
                  value={group.wagon_id.toString()}
                  className="rounded-lg shadow-sm border-none"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline bg-[#f0f5f2] border rounded-lg">
                    <div className="flex items-center justify-between w-full pr-4 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-gray-800 text-xl">
                          {t("wagonNo")} {group.wagon_number}
                        </span>
                        <Badge
                          className={cn(
                            "px-3 py-1 text-xs font-medium rounded-full",
                            getStatusStyles(group.currentStatus)
                          )}
                        >
                          {formatStatus(group.currentStatus, t)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-gray-400">
                          {t("lastUpdated")}{" "}
                          {format(new Date(group.lastUpdated), "dd/MM/yyyy")}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    {group.history.length > 0 ? (
                      <>
                        <h4 className="font-semibold text-gray-700 mb-4 mt-10">
                          {t("statusHistory")}
                        </h4>
                        <div className="space-y-3">
                          {group.history.map((historyItem, index) => (
                            <div
                              key={historyItem.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />

                              <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                                {format(
                                  new Date(historyItem.date),
                                  "dd/MM/yyyy"
                                )}
                              </span>

                              <span className="text-sm text-gray-600 flex-1">
                                {t("currentLocation")}{" "}
                                <span className="font-medium">
                                  {historyItem.current_location?.name ||
                                    t("na")}
                                </span>
                              </span>

                              <span className="text-sm text-gray-600 flex-1">
                                {t("plannedCurrentLocation")}{" "}
                                <span className="font-medium">
                                  {historyItem.planned_current_location?.name ||
                                    t("na")}
                                </span>
                              </span>

                              <span className="text-sm text-gray-600 flex-1">
                                {t("arrivalLocation")}{" "}
                                <span className="font-medium">
                                  {historyItem.arrival_location?.name ||
                                    t("na")}
                                </span>
                              </span>

                              <Badge
                                className={cn(
                                  "px-3 py-1 text-xs font-medium rounded-full",
                                  getStatusStyles(historyItem.status)
                                )}
                              >
                                {formatStatus(historyItem.status, t)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        {t("noStatusHistoryAvailable")}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">
                {t("noWagonsFoundMatchingYourSearch")}
              </p>
            </div>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              {t("previous")}
            </Button>
            <span className="flex items-center px-4 text-sm text-gray-600">
              {t("page")} {currentPage} {t("of")} {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              {t("next")}
            </Button>
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="mt-4 text-sm text-gray-600">
          {t("showing")} {groupedHistory.length} {t("of")} {total}{" "}
          {t("records")}
        </div>
      )}
    </div>
  );
}

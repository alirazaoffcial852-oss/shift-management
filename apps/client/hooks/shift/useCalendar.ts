import { useState, useEffect, useCallback } from "react";
import {
  startOfMonth,
  endOfMonth,
  format,
  getDaysInMonth,
  getDay,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Shift, STATUS } from "@/types/shift";
import { useGetShift } from "@/hooks/shift/useGetShift";
import { useRouter, useSearchParams } from "next/navigation";
import ShiftService from "@/services/shift";
import { toast } from "sonner";
import { useAuth, useCompany } from "@/providers/appProvider";
import { CalendarFilterState } from "@/components/Calendar/CalendarFilters";
import { useShiftStatusActions } from "./useShiftStatusActions";

export const useCalendar = (view?: "weekly" | "monthly") => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isEmployee } = useAuth();
  const {
    setStartDate,
    setEndDate,
    weeklyShifts,
    globalShifts,
    setWeeklyShifts,
    setGlobalShifts,
    clearSelectedShifts,
    data,
    setSelectedShifts,
    fetchShifts,
    pathType,
    fetchWeeklyShifts,
    isLoading,
    error,
    refetchWithFilters,
  } = useGetShift();
  const { handleFixedShifts, handlePlannedShifts, handleDeleteShift } =
    useShiftStatusActions();
  const { company } = useCompany();
  const initializeDate = () => {
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    if (yearParam && monthParam) {
      const year = parseInt(yearParam);
      const month = parseInt(monthParam) - 1;
      return new Date(year, month, 1);
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState<Date>(initializeDate);
  const [totalDays, setTotalDays] = useState<number[]>([]);
  const [skipDays, setSkipDays] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [filters, setFilters] = useState<CalendarFilterState>({
    status: null,
    employee_id: null,
    project_id: null,
    product_id: null,
    bv_project_id: null,
    customer_id: null,
    location: null,
    personnel_id: null,
  });

  const applyFilters = useCallback(
    (newFilters: CalendarFilterState) => {
      console.log("Applying filters:", newFilters);
      setFilters(newFilters);

      const yearParam = searchParams.get("year");
      const monthParam = searchParams.get("month");

      let year: number, month: number;

      if (yearParam && monthParam) {
        year = parseInt(yearParam);
        month = parseInt(monthParam) - 1;
      } else {
        year = currentDate.getFullYear();
        month = currentDate.getMonth();
      }

      const monthStart = startOfMonth(new Date(year, month));
      const monthEnd = endOfMonth(new Date(year, month));

      console.log("Filtering with date range:", {
        year,
        month: month + 1,
        monthStart,
        monthEnd,
      });

      refetchWithFilters(newFilters, {
        start: monthStart,
        end: monthEnd,
      });
    },
    [refetchWithFilters, currentDate, searchParams]
  );

  const updateUrlWithDate = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const params = new URLSearchParams(searchParams.toString());
      params.set("year", year.toString());
      params.set("month", month.toString());

      setTimeout(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      }, 0);
    },
    [router, searchParams]
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const goToSpecificMonth = useCallback(
    (year: number, month: number) => {
      const newDate = new Date(year, month - 1, 1);
      setCurrentDate(newDate);
      updateUrlWithDate(newDate);
    },
    [updateUrlWithDate]
  );

  const handleMonthYearSelect = useCallback(
    (year: number, month: number) => {
      const newDate = new Date(year, month, 1);
      setCurrentDate(newDate);
      updateUrlWithDate(newDate);
    },
    [updateUrlWithDate]
  );

  const handlePreviousWeek = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = subWeeks(prevDate, 1);
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleNextWeek = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = addWeeks(prevDate, 1);
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleEditShifts = useCallback(
    (shifts: Shift[], action?: string) => {
      if (shifts.length > 0) {
        localStorage.setItem("selectedShifts", JSON.stringify(shifts));
        const url = action
          ? `/shift-management/regular-shifts/edit?action=${action}`
          : "/shift-management/regular-shifts/edit";
        setTimeout(() => {
          router.push(url, { scroll: false });
        }, 0);
      }
    },
    [router]
  );

  const handleTimeSheet = useCallback(
    (shifts: Shift[]) => {
      if (shifts.length > 0) {
        localStorage.setItem("selectedShifts", JSON.stringify(shifts));
        const url = `/time-sheet/regular-shifts-timesheets/add`;
        setTimeout(() => {
          router.push(url, { scroll: false });
        }, 0);
      }
    },
    [router]
  );

  const handleHandoverBook = useCallback(
    (shifts: Shift[]) => {
      if (shifts.length > 0) {
        localStorage.setItem("selectedShifts", JSON.stringify(shifts));
        const url = `/handover-book/add`;
        setTimeout(() => {
          router.push(url, { scroll: false });
        }, 0);
      }
    },
    [router]
  );

  const handleShiftClick = useCallback((shift: Shift) => {
    console.log("Shift clicked:", shift);
  }, []);

  const handleCreateShift = useCallback(
    (date: Date) => {
      setTimeout(() => {
        router.push(
          `/shift-management/regular-shifts/add?date=${format(date, "yyyy-MM-dd")}`,
          { scroll: false }
        );
      }, 0);
    },
    [router]
  );

  const handleCreateOfferShift = useCallback(
    (date: Date) => {
      setTimeout(() => {
        router.push(
          `/shift-management/regular-shifts/add?date=${format(date, "yyyy-MM-dd")}&offer=true`,
          { scroll: false }
        );
      }, 0);
    },
    [router]
  );

  const handleEditShift = useCallback(
    (shift: Shift) => {
      if (shift) {
        localStorage.setItem("selectedShifts", JSON.stringify([shift]));
        setTimeout(() => {
          router.push("/shift-management/regular-shifts/edit", {
            scroll: false,
          });
        }, 0);
      }
    },
    [router]
  );

  const handleAssignShift = useCallback(
    (shift: Shift) => {
      if (shift) {
        localStorage.setItem("selectedShifts", JSON.stringify([shift]));
        setTimeout(() => {
          router.push("/shift-management/regular-shifts/edit?action=assign", {
            scroll: false,
          });
        }, 0);
      }
    },
    [router]
  );

  const handleAssignShiftSuccess = useCallback(
    (updatedShift: Shift, calendarKey: string) => {
      const prevShifts = weeklyShifts[calendarKey] || [];
      const updatedShifts = prevShifts.map((s: Shift) =>
        s.id?.toString() === updatedShift.id?.toString() ? updatedShift : s
      );
      setWeeklyShifts(calendarKey, updatedShifts);
    },
    [setWeeklyShifts, weeklyShifts]
  );

  const handleChangeStatus = (shift: Shift, newStatus: string) => {};

  // Timesheet and billing actions
  const handleAddTimesheet = (shift: Shift) => {
    console.log("Add timesheet for shift:", shift);
    // Add implementation for adding a timesheet
  };

  const handleMarkAsBilled = (shift: Shift) => {
    console.log("Mark shift as billed:", shift);
    // Add implementation for marking a shift as billed
  };

  const handleApproveShift = (shift: Shift) => {
    console.log("Approve shift:", shift);
    // Add implementation for approving a shift
  };

  // Calendar calculations
  useEffect(() => {
    if (view === "weekly") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      setStartDate(weekStart);
      setEndDate(weekEnd);
    } else if (view === "monthly") {
      const calculateDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        setStartDate(startOfMonth(new Date(year, month)));
        setEndDate(endOfMonth(new Date(year, month)));

        const firstDayOfMonth = startOfMonth(new Date(year, month));
        const daysInMonth = getDaysInMonth(new Date(year, month));
        const startOfMonthDay = getDay(firstDayOfMonth);
        const adjustedStartOfMonthDay =
          startOfMonthDay === 0 ? 6 : startOfMonthDay - 1;

        const currentMonthName = new Date(year, month).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
          }
        );
        const todayOfMonth = String(new Date().getDate()).padStart(2, "0");

        setTotalDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        setSkipDays(
          Array.from({ length: adjustedStartOfMonthDay }, (_, i) => i + 1)
        );
        setCurrentMonth(currentMonthName);
      };

      calculateDaysInMonth();
    }
  }, [currentDate, setStartDate, setEndDate, view, company]);

  return {
    // State
    currentDate,
    currentMonth,
    totalDays,
    skipDays,
    data,
    setSelectedShifts,
    globalShifts,
    clearSelectedShifts,
    weeklyShifts,
    setGlobalShifts,
    setWeeklyShifts,
    isEmployee,
    fetchWeeklyShifts,
    isLoading,
    error,

    // Navigation actions
    handlePreviousMonth,
    handleNextMonth,
    goToSpecificMonth,
    handleMonthYearSelect,
    handlePreviousWeek: view === "weekly" ? handlePreviousWeek : undefined,
    handleNextWeek: view === "weekly" ? handleNextWeek : undefined,

    // Shift actions
    handleFixedShifts,
    handlePlannedShifts,
    handleEditShifts,
    handleShiftClick,
    handleCreateShift,
    handleEditShift,
    handleDeleteShift,
    handleChangeStatus,
    handleAddTimesheet,
    handleMarkAsBilled,
    handleApproveShift,
    handleCreateOfferShift,
    handleAssignShift,
    handleAssignShiftSuccess,
    handleTimeSheet,
    handleHandoverBook,
    fetchShifts,
    applyFilters,
    pathType,
  };
};

"use client";
import { useState, useCallback, useEffect } from "react";
import ShiftService from "@/services/shift";
import { Shift, STATUS } from "@/types/shift";
import { useShift } from "@/providers/shiftProvider";
import { usePathname } from "next/navigation";
import { Company } from "@/types/configuration";
import { useCompany } from "@/providers/appProvider";
import { CalendarFilterState } from "@/components/Calendar/CalendarFilters";

export const useGetShift = () => {
  const currentPath = usePathname();
  const pathType = currentPath.includes("/weekly") ? "weekly" : currentPath.includes("/monthly") ? "monthly" : null;

  const { data, setWeeklyShifts, setSelectedShifts, setGlobalShifts, clearSelectedShifts } = useShift();
  const { company } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();
  const [status, setStatus] = useState<STATUS>("OPEN");

  const fetchShifts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!startDate && !endDate) return;
      if (pathType === "weekly") return;

      const response = await ShiftService.getAllShifts(startDate?.toString() || "", endDate?.toString() || "", null, null, company?.id);

      setGlobalShifts(response.data.data || []);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch Shifts";
      setError(errorMsg);
      console.error("Error fetching Shifts:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, pathType, setGlobalShifts, company]);

  const fetchWeeklyShifts = useCallback(
    async (startDate: Date | null, endDate: Date | null, roleIds: number[] = [], locomotiveIds: number[] = [], company: Company | null) => {
      setIsLoading(true);
      setError(null);
      try {
        if (!startDate || !endDate || !company?.id) return;

        const formattedStartDate = startDate ? startDate.toISOString().split("T")[0] : "";
        const formattedEndDate = endDate ? endDate.toISOString().split("T")[0] : "";

        const response = await ShiftService.getWeeklyShifts(formattedStartDate || "", formattedEndDate || "", company?.id || 0, roleIds, locomotiveIds.length > 0);

        // Set shifts for roles
        roleIds.forEach((roleId) => {
          const roleKey = `role${roleId}`;
          const roleShifts = response.data.shifts_against_roles[`role${roleId}`] || [];
          setWeeklyShifts(roleKey, roleShifts);
        });
        if (locomotiveIds.length > 0) {
          const locomotiveShifts = response.data.shifts_against_locomotives || [];

          setWeeklyShifts("locomotives", locomotiveShifts);
        }

        return response.data;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch Shifts";
        setError(errorMsg);
        console.error("Error fetching Shifts:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [status, setWeeklyShifts]
  );

  useEffect(() => {
    if (startDate && endDate) {
      fetchShifts();
    }
  }, [startDate, endDate]);

  const refetchWithFilters = useCallback(
    async (filterParams?: CalendarFilterState, forceDates?: { start: Date; end: Date }) => {
      console.log("refetchWithFilters called with:", filterParams, forceDates);
      setIsLoading(true);
      setError(null);

      try {
        const from = forceDates?.start || startDate;
        const to = forceDates?.end || endDate;

        if (!from || !to) {
          console.log("Missing dates for API call");
          setIsLoading(false);
          return;
        }

        if (pathType === "weekly") {
          setIsLoading(false);
          return;
        }

        const employee_ids = filterParams?.employee_id ? filterParams.employee_id.map((id) => parseInt(id)) : null;

        const response = await ShiftService.getAllShifts(from.toString(), to.toString(), employee_ids, filterParams?.status || "ALL", company?.id, {
          project_id: filterParams?.project_id ? filterParams.project_id.map((id) => parseInt(id)) : null,
          product_id: filterParams?.product_id ? filterParams.product_id.map((id) => parseInt(id)) : null,
          bv_project_id: filterParams?.bv_project_id ? filterParams.bv_project_id.map((id) => parseInt(id)) : null,
          customer_id: filterParams?.customer_id ? filterParams.customer_id.map((id) => parseInt(id)) : null,
          personnel_id: filterParams?.personnel_id ? filterParams.personnel_id.map((id) => parseInt(id)) : null,
          location: filterParams?.location || null,
        });

        setGlobalShifts(response.data.data || []);
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch Shifts";
        setError(errorMsg);
        console.error("Error fetching Shifts:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setGlobalShifts, pathType]
  );

  return {
    fetchShifts,
    weeklyShifts: data.weeklyShifts,
    globalShifts: data.globalShifts,
    setWeeklyShifts,
    setGlobalShifts,
    data,
    setSelectedShifts: setSelectedShifts,
    clearSelectedShifts,
    pathType,
    isLoading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    refetch: fetchShifts,
    fetchWeeklyShifts,
    refetchWithFilters,
  };
};

"use client";
import React, { useState, useEffect, useRef } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import { getWeekDays } from "@/utils/calendar";
import { useCalendar } from "@/hooks/shift/useCalendar";
import CalendarActions from "@/components/Calendar/CalendarActions";
import { useRoleManager } from "@/hooks/role/useRole";
import { RoleCalendar } from "@/components/WeeklyView/RoleCalendar";
import { LocomotivesCalendar } from "@/components/WeeklyView/LocomotivesCalendar";
import { useProductTable } from "@/hooks/product/useProductTable";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { useCompany, useAuth } from "@/providers/appProvider";
import ShiftService from "@/services/shift";

export default function WeeklyView() {
  const {
    data,
    weeklyShifts,
    setWeeklyShifts,
    handleShiftClick,
    setSelectedShifts,
    fetchWeeklyShifts,
    applyFilters,
    filters,
    setGlobalShifts,
    globalShifts,
  } = useCalendar("weekly");
  const { company } = useCompany();
  const { user } = useAuth();

  const [calendarDates, setCalendarDates] = useState<{ [key: string]: Date }>(
    {}
  );
  const { products } = useProductTable();
  const { locomotives } = useLocomotiveTable();
  const { existingRoles } = useRoleManager({
    actAs: "EMPLOYEE",
    withSearch: true,
    forDropdown: true,
    initialLimit: 20,
  });

  const isInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const lastFetchParams = useRef<string>("");
  const currentFilters = useRef<any>(null);

  const fetchShiftsLikeMonthly = async (
    weekStart: Date,
    weekEnd: Date,
    filterParams?: any
  ) => {
    try {
      const employee_ids = filterParams?.employee_id
        ? filterParams.employee_id.map((id: string) => parseInt(id))
        : null;

      const response = await ShiftService.getAllShifts(
        weekStart.toString(),
        weekEnd.toString(),
        employee_ids,
        filterParams?.status || "ALL",
        company?.id || undefined,
        {
          project_id: filterParams?.project_id
            ? filterParams.project_id.map((id: string) => parseInt(id))
            : null,
          product_id: filterParams?.product_id
            ? filterParams.product_id.map((id: string) => parseInt(id))
            : null,
          bv_project_id: filterParams?.bv_project_id
            ? filterParams.bv_project_id.map((id: string) => parseInt(id))
            : null,
          customer_id: filterParams?.customer_id
            ? filterParams.customer_id.map((id: string) => parseInt(id))
            : null,
          personnel_id: filterParams?.personnel_id
            ? filterParams.personnel_id.map((id: string) => parseInt(id))
            : null,
          location: filterParams?.location || null,
        }
      );

      const allShifts = response.data.data || [];

      setGlobalShifts(allShifts);

      const transformedShifts = allShifts.map((shift: any) => {
        // If locomotive_id is not at root but exists in shiftLocomotive array, extract it
        if (!shift.locomotive_id && shift.shiftLocomotive && shift.shiftLocomotive.length > 0) {
          shift.locomotive_id = shift.shiftLocomotive[0].locomotive_id;
        }
        return shift;
      });

      const locomotiveShifts = transformedShifts.filter(
        (shift: any) => shift.shiftDetail?.has_locomotive
      );
      
      console.log("📅 Setting locomotive shifts:", {
        totalShifts: allShifts.length,
        locomotiveShifts: locomotiveShifts.length,
        shifts: locomotiveShifts.map((s: any) => ({
          id: s.id,
          date: s.date,
          locomotive_id: s.locomotive_id,
          has_locomotive: s.shiftDetail?.has_locomotive,
        })),
      });
      
      setWeeklyShifts("locomotives", locomotiveShifts);

      if (existingRoles && existingRoles.length > 0) {
        existingRoles.forEach((role) => {
          const roleKey = `role${role.id}`;
          const roleShifts = transformedShifts.filter((shift: any) =>
            shift.shiftRole?.some((sr: any) => Number(sr.role_id) === role.id)
          );
          setWeeklyShifts(roleKey, roleShifts);
        });
      }

      return allShifts;
    } catch (error) {
      console.error("Error fetching shifts:", error);
      return [];
    }
  };

  useEffect(() => {
    if (isInitialized.current) return;

    const currentDate = new Date();
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    const initialDates: { [key: string]: Date } = {
      locomotives: currentDate,
      ...Object.fromEntries(
        (existingRoles || []).map((role) => [`role${role.id}`, currentDate])
      ),
    };
    setCalendarDates(initialDates);

    const roleIds = (existingRoles || [])
      .map((role) => role.id)
      .filter((id): id is number => typeof id === "number");
    const locIds = (locomotives || [])
      .map((loc) => loc.id)
      .filter((id): id is number => typeof id === "number");

    const currentFilterKey = JSON.stringify(currentFilters.current || {});
    const fetchKey = `${weekStart.getTime()}-${weekEnd.getTime()}-${roleIds.join(",")}-${locIds.join(",")}-${currentFilterKey}`;

    if (lastFetchParams.current !== fetchKey) {
      console.log("Initial fetch with:", {
        weekStart,
        weekEnd,
        roleIds,
        locIds,
        company: company?.id,
        useMonthlyMethod: !roleIds.length && !locIds.length,
      });

      lastFetchParams.current = fetchKey;
      isInitialized.current = true;

      if (!roleIds.length && !locIds.length) {
        fetchShiftsLikeMonthly(weekStart, weekEnd, currentFilters.current);
      } else if (company?.id) {
        fetchWeeklyShifts(
          weekStart,
          weekEnd,
          roleIds,
          locIds,
          company,
          currentFilters.current
        );
      }
    }
  }, [
    existingRoles,
    locomotives,
    company,
    fetchWeeklyShifts,
    setGlobalShifts,
    setWeeklyShifts,
  ]);

  useEffect(() => {
    if (!isInitialized.current) return;
    if (isLoadingRef.current) return; // Prevent duplicate calls

    currentFilters.current = filters;
    
    const primaryDate = 
      calendarDates["locomotives"] || 
      (existingRoles?.[0] ? calendarDates[`role${existingRoles[0].id}`] : null) ||
      new Date();
    
    const weekStart = startOfWeek(primaryDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(primaryDate, { weekStartsOn: 1 });

    const roleIds = (existingRoles || [])
      .map((role) => role.id)
      .filter((id): id is number => typeof id === "number");
    const locIds = (locomotives || [])
      .map((loc) => loc.id)
      .filter((id): id is number => typeof id === "number");

    const fetchKey = `${weekStart.getTime()}-${weekEnd.getTime()}-${roleIds.join(",")}-${locIds.join(",")}-${JSON.stringify(filters)}`;

    if (lastFetchParams.current !== fetchKey) {
      lastFetchParams.current = fetchKey;
      isLoadingRef.current = true;

      if (!roleIds.length && !locIds.length) {
        fetchShiftsLikeMonthly(weekStart, weekEnd, filters).finally(() => {
          isLoadingRef.current = false;
        });
      } else if (company?.id) {
        fetchWeeklyShifts(
          weekStart,
          weekEnd,
          roleIds,
          locIds,
          company,
          filters
        ).finally(() => {
          isLoadingRef.current = false;
        });
      } else {
        isLoadingRef.current = false;
      }
    }
  }, [
    filters,
    existingRoles,
    locomotives,
    company,
    fetchWeeklyShifts,
    setGlobalShifts,
    setWeeklyShifts,
  ]);

  const handleCalendarDateChange = async (
    calendarKey: string,
    newDate: Date,
    type: "role" | "locomotive"
  ) => {
    console.log("handleCalendarDateChange called", {
      calendarKey,
      newDate,
      type,
      company: company?.id,
    });

    if (type === "role") {
      const updatedDates: { [key: string]: Date } = {
        locomotives: calendarDates["locomotives"] || newDate,
        ...Object.fromEntries(
          (existingRoles || []).map((role) => [`role${role.id}`, newDate])
        ),
      };
      setCalendarDates(updatedDates);
    } else {
      setCalendarDates((prev) => ({ ...prev, [calendarKey]: newDate }));
    }

    const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(newDate, { weekStartsOn: 1 });

    const roleIds = (existingRoles || [])
      .map((role) => role.id)
      .filter((id): id is number => typeof id === "number");
    const locIds = (locomotives || [])
      .map((loc) => loc.id)
      .filter((id): id is number => typeof id === "number");

    const currentFilterKey = JSON.stringify(filters || {});
    const fetchKey = `${weekStart.getTime()}-${weekEnd.getTime()}-${roleIds.join(",")}-${locIds.join(",")}-${currentFilterKey}`;

    if (lastFetchParams.current === fetchKey) {
      console.log("Skipping fetch - same parameters");
      return;
    }

    console.log("Making API call with:", {
      weekStart,
      weekEnd,
      roleIds,
      locIds,
      company: company?.id,
      filters,
      useMonthlyMethod: !roleIds.length && !locIds.length,
    });
    isLoadingRef.current = true;
    lastFetchParams.current = fetchKey;

    try {
      if (!roleIds.length && !locIds.length) {
        await fetchShiftsLikeMonthly(weekStart, weekEnd, filters);
      } else if (company?.id) {
        await fetchWeeklyShifts(
          weekStart,
          weekEnd,
          roleIds,
          locIds,
          company,
          filters
        );
      }
      console.log("API call completed");
    } catch (error) {
      console.error("Error in fetchWeeklyShifts:", error);
    } finally {
      isLoadingRef.current = false;
    }
  };
  return (
    <div className="w-full">
      <div className="mb-6">
        <CalendarActions selectedShiftsCount={0} selectedShifts={[]} />
      </div>

      <div className="mb-8">
        <LocomotivesCalendar
          locomotives={locomotives}
          currentDate={calendarDates["locomotives"] || new Date()}
          weekDays={getWeekDays(calendarDates["locomotives"] || new Date())}
          shifts={weeklyShifts["locomotives"] || []}
          allShifts={weeklyShifts["locomotives"] || []}
          selectedShifts={data.selectedShifts["locomotives"] || []}
          onShiftClick={handleShiftClick}
          onShiftSelect={(shift) => setSelectedShifts("locomotives", [shift])}
          onShiftsChange={(shifts) => setWeeklyShifts("locomotives", shifts)}
          products={products}
          onDateChange={(newDate) => {
            console.log("Locomotive date change:", newDate);

            setCalendarDates((prev) => ({ ...prev, locomotives: newDate }));
            const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(newDate, { weekStartsOn: 1 });

            const roleIds = (existingRoles || [])
              .map((role) => role.id)
              .filter((id): id is number => typeof id === "number");
            const locIds = (locomotives || [])
              .map((loc) => loc.id)
              .filter((id): id is number => typeof id === "number");

            const currentFilterKey = JSON.stringify(filters || {});
            const fetchKey = `${weekStart.getTime()}-${weekEnd.getTime()}-${roleIds.join(",")}-${locIds.join(",")}-${currentFilterKey}`;

            if (lastFetchParams.current === fetchKey) {
              console.log("Skipping locomotive fetch - same parameters");
              return;
            }

            console.log("Making locomotive API call with:", {
              weekStart,
              weekEnd,
              roleIds,
              locIds,
              company: company?.id,
              filters,
              useMonthlyMethod: !roleIds.length && !locIds.length,
            });
            isLoadingRef.current = true;
            lastFetchParams.current = fetchKey;

            if (!roleIds.length && !locIds.length) {
              fetchShiftsLikeMonthly(weekStart, weekEnd, filters).finally(
                () => {
                  isLoadingRef.current = false;
                  console.log("Locomotive API call completed (monthly method)");
                }
              );
            } else if (company?.id) {
              fetchWeeklyShifts(
                weekStart,
                weekEnd,
                roleIds,
                locIds,
                company,
                filters
              ).finally(() => {
                isLoadingRef.current = false;
                console.log("Locomotive API call completed");
              });
            } else {
              isLoadingRef.current = false;
            }
          }}
        />
      </div>

      {existingRoles?.map((role) => {
        const calendarKey = `role${role.id}`;
        const currentDate = calendarDates[calendarKey] || new Date();
        const weekDays = getWeekDays(currentDate);
        const roleShifts = weeklyShifts[calendarKey] || [];
        const selectedShifts = data.selectedShifts[calendarKey] || [];

        return (
          <div key={calendarKey} className="mb-8">
            <RoleCalendar
              role={role}
              currentDate={currentDate}
              weekDays={weekDays}
              shifts={roleShifts}
              allShifts={roleShifts}
              selectedShifts={selectedShifts}
              onShiftClick={handleShiftClick}
              onShiftSelect={(shift) => setSelectedShifts(calendarKey, [shift])}
              onShiftsChange={(shifts) => setWeeklyShifts(calendarKey, shifts)}
              products={products}
              onDateChange={(newDate) =>
                handleCalendarDateChange(calendarKey, newDate, "role")
              }
              locomotives={locomotives}
            />
          </div>
        );
      })}
    </div>
  );
}

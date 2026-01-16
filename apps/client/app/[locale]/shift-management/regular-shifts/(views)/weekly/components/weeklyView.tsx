"use client";
import React, { useState, useEffect } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import { getWeekDays } from "@/utils/calendar";
import { useCalendar } from "@/hooks/shift/useCalendar";
import CalendarActions from "@/components/Calendar/CalendarActions";
import { useRoleManager } from "@/hooks/role/useRole";
import { RoleCalendar } from "@/components/WeeklyView/RoleCalendar";
import { LocomotivesCalendar } from "@/components/WeeklyView/LocomotivesCalendar";
import { useProductTable } from "@/hooks/product/useProductTable";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { useCompany } from "@/providers/appProvider";

export default function WeeklyView() {
  const {
    data,
    weeklyShifts,
    setWeeklyShifts,
    handleShiftClick,
    setSelectedShifts,
    fetchWeeklyShifts,
  } = useCalendar("weekly");
  const { company } = useCompany();

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
  console.log(existingRoles, "existingRoles");
  // Single useEffect for initial load
  useEffect(() => {
    if (!existingRoles?.length || !locomotives?.length) return;

    const currentDate = new Date();
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

    // Initialize dates once we have both roles and locomotives
    const initialDates: { [key: string]: Date } = {
      locomotives: currentDate,
      ...Object.fromEntries(
        existingRoles.map((role) => [`role_${role.id}`, currentDate])
      ),
    };
    setCalendarDates(initialDates);

    // Single API call with all IDs
    const roleIds = existingRoles
      .map((role) => role.id)
      .filter((id): id is number => typeof id === "number");
    const locIds = locomotives
      .map((loc) => loc.id)
      .filter((id): id is number => typeof id === "number");
    console.log(roleIds, "roleIdsroleIds");
    // Only make the API call if we have IDs to fetch
    if (roleIds.length > 0 || locIds.length > 0) {
      fetchWeeklyShifts(weekStart, weekEnd, roleIds, locIds, company);
    }
  }, [existingRoles, locomotives]); // Only depend on the data we need

  const handleCalendarDateChange = async (
    calendarKey: string,
    newDate: Date,
    type: "role" | "locomotive"
  ) => {
    setCalendarDates((prev) => ({ ...prev, [calendarKey]: newDate }));

    const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(newDate, { weekStartsOn: 1 });

    const id = parseInt(calendarKey.split("_")[1] || "0");
    const roleIds = type === "role" ? [id] : [];
    const locIds = type === "locomotive" ? [id] : [];

    await fetchWeeklyShifts(weekStart, weekEnd, roleIds, locIds, company);
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
            setCalendarDates((prev) => ({ ...prev, locomotives: newDate }));
            const weekStart = startOfWeek(newDate, { weekStartsOn: 1 });
            const weekEnd = endOfWeek(newDate, { weekStartsOn: 1 });
            const locIds = locomotives
              .map((loc) => loc.id)
              .filter(Boolean) as number[];
            fetchWeeklyShifts(weekStart, weekEnd, [], locIds, company);
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

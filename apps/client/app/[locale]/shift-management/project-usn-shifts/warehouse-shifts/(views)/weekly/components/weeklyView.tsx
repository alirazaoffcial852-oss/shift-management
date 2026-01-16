"use client";
import React from "react";
import { useProjectUSNCalendar } from "@/hooks/projectUsnShifts/useProjectUSNCalendar";
import WarehouseShiftsActions from "@/components/WarehouseShiftsActions";
import WarehouseShiftsWeeklyView from "@/components/ProjectUSNCalendar/WarehouseShiftsWeeklyView";

export default function WeeklyView() {
  const { selectedShifts } = useProjectUSNCalendar("weekly", "warehouse");

  return (
    <div className="w-full">
      <div className="mb-6">
        <WarehouseShiftsActions selectedShiftsCount={selectedShifts.length} />
      </div>
      <WarehouseShiftsWeeklyView />
    </div>
  );
}

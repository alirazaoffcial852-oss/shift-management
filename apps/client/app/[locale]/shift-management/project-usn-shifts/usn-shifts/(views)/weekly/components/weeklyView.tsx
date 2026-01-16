"use client";
import React from "react";
import { useProjectUSNCalendar } from "@/hooks/projectUsnShifts/useProjectUSNCalendar";
import UsnShiftsActions from "@/components/UsnShiftsActions";
import UsnShiftsWeeklyView from "@/components/ProjectUSNCalendar/UsnShiftsWeeklyView";

export default function WeeklyView() {
  const { selectedShifts } = useProjectUSNCalendar("weekly", "usn");

  return (
    <div className="w-full">
      <div className="mb-6">
        <UsnShiftsActions selectedShiftsCount={selectedShifts.length} />
      </div>
      <UsnShiftsWeeklyView />
    </div>
  );
}

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ProjectUSNShift } from "@/types/projectUsn";
import { ProjectUSNShiftEvent } from "./ProjectUSNShiftEvent";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@workspace/ui/components/context-menu";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/appProvider";
import { BulkUSNShiftActions } from "../UsnShiftsActions/BulkUSNShiftActions";
import { usePermission } from "@/hooks/usePermission";

interface ProjectUSNShiftDayCellProps {
  date: Date;
  shifts: ProjectUSNShift[];
  allShifts: ProjectUSNShift[];
  selectedShifts: ProjectUSNShift[];
  onShiftsChange: (shifts: ProjectUSNShift[]) => void;
  onShiftClick: (shift: ProjectUSNShift) => void;
  onShiftSelect: (shift: ProjectUSNShift) => void;
  onDragStart?: (shift: ProjectUSNShift) => void;
  onDragEnd?: () => void;
  onDrop?: (
    date: Date,
    roleId?: number,
    employeeId?: number,
    locomotiveId?: number
  ) => void;
  draggedShift?: ProjectUSNShift | null;
  onDeleteShift?: (shiftId: number) => void;
  handleFixedShifts?: (shifts: ProjectUSNShift[]) => Promise<boolean>;
  handlePlannedShifts?: (shifts: ProjectUSNShift[]) => Promise<boolean>;
  handleTimeSheet?: (shifts: ProjectUSNShift[]) => void;
  handleHandoverBook?: (shifts: ProjectUSNShift[]) => void;
  locomotives?: any[];
  roleId?: number | null;
  employeeId?: number | null;
  locomotiveId?: number | null;
}

export function ProjectUSNShiftDayCell({
  date,
  shifts,
  allShifts,
  selectedShifts,
  onShiftsChange,
  onShiftClick,
  onShiftSelect,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedShift,
  onDeleteShift,
  handleFixedShifts,
  handlePlannedShifts,
  handleTimeSheet,
  handleHandoverBook,
  locomotives = [],
  roleId = null,
  employeeId = null,
  locomotiveId = null,
}: ProjectUSNShiftDayCellProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isEmployee } = useAuth();
  const { hasPermission } = usePermission();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop?.(
      date,
      roleId ?? undefined,
      employeeId ?? undefined,
      locomotiveId ?? undefined
    );
  };

  const isToday =
    format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const hasSelectedShifts = selectedShifts.length > 0;

  const getCurrentView = () => {
    if (pathname.includes("/monthly")) return "monthly";
    if (pathname.includes("/weekly")) return "weekly";
    return "monthly";
  };

  const handleCreateShift = () => {
    const dateString = format(date, "yyyy-MM-dd");
    const currentView = getCurrentView();
    router.push(
      `/shift-management/project-usn-shifts/add?date=${dateString}&returnTo=${currentView}`
    );
  };

  const handleEditSelectedShifts = () => {
    const currentView = getCurrentView();
    if (selectedShifts.length === 1 && selectedShifts[0]?.id !== undefined) {
      router.push(
        `/shift-management/project-usn-shifts/${selectedShifts[0].id}?returnTo=${currentView}`
      );
    } else {
      console.log("Bulk edit for multiple shifts:", selectedShifts);
    }
  };

  const handleDeleteSelectedShifts = () => {
    if (onDeleteShift && selectedShifts.length > 0) {
      selectedShifts.forEach((shift) => {
        if (shift.id) onDeleteShift(shift.id);
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`border border-[#E0E0E0] min-h-[120px] w-full p-2 transition-colors 
            ${isDragOver ? "bg-blue-50" : ""} 
            ${isToday ? "bg-blue-50/30" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-sm font-semibold text-gray-700 mb-1">
            {format(date, "d")}
          </div>

          <div className="space-y-1">
            {shifts.map((shift) => (
              <ProjectUSNShiftEvent
                key={shift.id}
                onShiftSelect={onShiftSelect}
                shift={shift}
                allShifts={allShifts}
                onShiftsChange={onShiftsChange}
                onClick={onShiftClick}
                onSelect={onShiftSelect}
                isSelected={selectedShifts.some((s) => s.id === shift.id)}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={draggedShift?.id === shift.id}
                currentView="monthly"
                locomotives={locomotives}
              />
            ))}
          </div>
        </div>
      </ContextMenuTrigger>

      {hasSelectedShifts
        ? handleFixedShifts &&
          handlePlannedShifts &&
          handleTimeSheet && (
            <BulkUSNShiftActions
              selectedShifts={selectedShifts}
              handleFixedShifts={handleFixedShifts}
              handlePlannedShifts={handlePlannedShifts}
              handleDeleteShift={handleDeleteSelectedShifts}
              handleTimeSheet={handleTimeSheet}
              handleHandoverBook={handleHandoverBook}
              handleEditShifts={handleEditSelectedShifts}
            />
          )
        : !isEmployee &&
          hasPermission("usn-shift.create") && (
            <ContextMenuContent className="w-64">
              <ContextMenuItem
                onClick={handleCreateShift}
                className="cursor-pointer"
              >
                Create USN Shift
              </ContextMenuItem>
            </ContextMenuContent>
          )}
    </ContextMenu>
  );
}

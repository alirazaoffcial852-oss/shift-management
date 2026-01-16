import React from "react";
import { Shift } from "@/types/shift";
import { format } from "date-fns";
import { ShiftEvent } from "../Shift/ShiftEvent";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@workspace/ui/components/context-menu";
import { DayCellActions } from "./DayCellActions";
import { useCalendar } from "@/hooks/shift/useCalendar";
import { cn } from "@workspace/ui/lib/utils";
import { updateShiftData } from "@/utils/shiftUpdate";
import { Product } from "@/types/product";
import { toast } from "sonner";
import ShiftService from "@/services/shift";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { Locomotive } from "@/types/locomotive";

interface DayCellProps {
  date: Date;
  shifts: Shift[];
  allShifts: Shift[];
  onShiftsChange: (shifts: Shift[]) => void;
  selectedShifts: Shift[];
  onShiftClick?: (shift: Shift) => void;
  onShiftSelect: (shift: Shift) => void;
  products: Product[];
  disableUpdate?: boolean;
  employeeId?: number | null;
  isOpenShiftCell?: boolean;
  locomotiveId?: number | null;
  isLocomotiveCell?: boolean;
  calendarKey?: string;
  locomotives: Locomotive[];
}

export const DayCell = ({
  date,
  shifts,
  allShifts,
  onShiftsChange,
  products,
  onShiftClick,
  selectedShifts,
  onShiftSelect,
  disableUpdate = false,
  employeeId = null,
  isOpenShiftCell = false,
  locomotiveId = null,
  isLocomotiveCell = false,
  calendarKey,
  locomotives,
}: DayCellProps) => {
  const { handleEditShifts, handleAssignShiftSuccess, isEmployee } =
    useCalendar();

  const sortedShifts = [...shifts].sort(
    (a, b) =>
      new Date(a.start_time || 0).getTime() -
      new Date(b.start_time || 0).getTime()
  );

  const hasSelectedShifts = selectedShifts.length > 0;

  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (disableUpdate) return;

    const shiftId = e.dataTransfer.getData("shiftId");
    const roleIds = JSON.parse(e.dataTransfer.getData("roleIds") || "[]");
    const isAssigned = e.dataTransfer.getData("isAssigned") === "true";
    const currentEmployeeId = e.dataTransfer.getData("currentEmployeeId");
    const currentLocomotiveId = e.dataTransfer.getData("currentLocomotiveId");
    const shiftToUpdate = allShifts.find((s) => s.id?.toString() === shiftId);

    if (!shiftToUpdate) return;

    if (isOpenShiftCell && isAssigned) {
      toast.error("Assigned shifts cannot be moved to open shifts section");
      return;
    }

    const updatedShift = {
      ...shiftToUpdate,
      date: format(date, "yyyy-MM-dd"),
    };

    const isMovingWithinSameEmployee =
      employeeId !== null && currentEmployeeId === employeeId.toString();

    if (employeeId !== null && !isMovingWithinSameEmployee) {
      updatedShift.shiftRole = updatedShift.shiftRole?.map((role) => {
        if (roleIds.includes(role.role_id.toString())) {
          return {
            ...role,
            employee_id: employeeId.toString(),
          };
        }
        return role;
      });
    }

    const isMovingWithinSameLocomotive =
      locomotiveId !== null && currentLocomotiveId === locomotiveId.toString();

    if (locomotiveId !== null) {
      updatedShift.locomotive_id = locomotiveId.toString();
    }

    onShiftsChange(
      allShifts.map((s: Shift) =>
        s.id?.toString() === shiftId ? updatedShift : s
      )
    );

    try {
      if (employeeId !== null && !isMovingWithinSameEmployee) {
        const assignShiftsPayload = {
          assign_shifts: [
            {
              shift_id: parseInt(shiftId),
              shiftRole: updatedShift.shiftRole?.map((role) => ({
                employee_id: role.employee_id ? Number(role.employee_id) : null,
                proximity: role.proximity,
                break_duration: role.break_duration?.toString(),
                start_day: role.start_day,
              })),
            },
          ],
        };

        const formData = new FormData();
        formData.append(
          "assign_shifts",
          JSON.stringify(assignShiftsPayload.assign_shifts)
        );

        const response = await ShiftService.assignShifts(formData);

        if (response.data && response.data.length > 0) {
          const backendUpdatedShift = response.data[0];

          onShiftsChange(
            allShifts.map((s: Shift) =>
              s.id?.toString() === shiftId ? backendUpdatedShift : s
            )
          );

          if (calendarKey) {
            handleAssignShiftSuccess(backendUpdatedShift, calendarKey);

            const openShiftsKey = `role_${backendUpdatedShift.shiftRole?.[0]?.role_id}_open`;
            handleAssignShiftSuccess(backendUpdatedShift, openShiftsKey);
          }
        }

        toast.success(response.message);
      } else if (locomotiveId !== null && !isMovingWithinSameLocomotive) {
        const formData = new FormData();
        formData.append(
          "assign_shifts",
          JSON.stringify([
            {
              shift_id: parseInt(shiftId),
              locomotive_id: locomotiveId,
            },
          ])
        );
        let response = await ShiftService.assignLocomotiveToShift(formData);
        toast.success(response.message);
      } else {
        const success = await updateShiftData([updatedShift]);
        if (!success) {
          throw new Error("Failed to update shift");
        }
      }
    } catch (error: any) {
      console.log(error);
      onShiftsChange(
        allShifts.map((s: Shift) =>
          s.id?.toString() === shiftId ? shiftToUpdate : s
        )
      );
      toast.error(error.data.message);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "border border-dashed border-gray-300 min-h-[120px]  relative p-1 h-full",
            isToday && "bg-[#BFD6C8]/30",
            "transition-colors duration-200 hover:bg-gray-50"
          )}
        >
          <div
            className={cn(
              `absolute top-1 left-1 text-sm text-[#A1A1A1]`,
              isToday && "text-primary font-bold"
            )}
          >
            {format(date, "dd")}
          </div>
          <div className="pt-6 px-1 space-y-1 overflow-y-auto h-full">
            {sortedShifts.map((shift) => (
              <ShiftEvent
                key={shift.id}
                shift={shift}
                onShiftsChange={onShiftsChange}
                selectedShifts={selectedShifts}
                onShiftSelect={onShiftSelect}
                allShifts={allShifts}
                onClick={onShiftClick}
                isSelected={
                  shift.id
                    ? selectedShifts?.some((s: Shift) => s.id === shift.id)
                    : false
                }
                onSelect={(shift) => onShiftSelect(shift)}
                products={products}
                locomotives={locomotives}
              />
            ))}
          </div>
        </div>
      </ContextMenuTrigger>

      {hasSelectedShifts ? (
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={() => handleEditShifts(selectedShifts)}>
            Edit Shifts
          </ContextMenuItem>
        </ContextMenuContent>
      ) : (
        <>{!isEmployee && <DayCellActions date={date} />}</>
      )}
    </ContextMenu>
  );
};

import { useCallback } from "react";
import { Shift, STATUS } from "@/types/shift";
import ShiftService from "@/services/shift";
import { toast } from "sonner";
import { useGetShift } from "./useGetShift";

export const useShiftStatusActions = () => {
  const {
    globalShifts,
    setGlobalShifts,
    clearSelectedShifts,
    refetch,
    weeklyShifts,
    setWeeklyShifts,
  } = useGetShift();

  const updateWeeklyShiftStatus = useCallback(
    (shiftIds: Array<string | number | undefined>, status: STATUS) => {
      if (!weeklyShifts) return;
      const idSet = new Set(
        shiftIds
          .filter(
            (id): id is string | number =>
              typeof id === "number" || typeof id === "string"
          )
          .map((id) => id.toString())
      );
      if (idSet.size === 0) return;

      Object.entries(weeklyShifts).forEach(([key, shifts]) => {
        if (!Array.isArray(shifts) || shifts.length === 0) return;
        const hasMatch = shifts.some(
          (shift) => shift?.id && idSet.has(shift.id.toString())
        );
        if (!hasMatch) return;
        const updated = shifts.map((shift) =>
          shift?.id && idSet.has(shift.id.toString())
            ? { ...shift, status }
            : shift
        );
        setWeeklyShifts(key, updated);
      });
    },
    [weeklyShifts, setWeeklyShifts]
  );

  const removeShiftsFromWeekly = useCallback(
    (shiftIds: Array<string | number | undefined>) => {
      if (!weeklyShifts) return;
      const idSet = new Set(
        shiftIds
          .filter(
            (id): id is string | number =>
              typeof id === "number" || typeof id === "string"
          )
          .map((id) => id.toString())
      );
      if (idSet.size === 0) return;

      Object.entries(weeklyShifts).forEach(([key, shifts]) => {
        if (!Array.isArray(shifts) || shifts.length === 0) return;
        const filtered = shifts.filter(
          (shift) => !shift?.id || !idSet.has(shift.id.toString())
        );
        if (filtered.length !== shifts.length) {
          setWeeklyShifts(key, filtered);
        }
      });
    },
    [weeklyShifts, setWeeklyShifts]
  );

  const handleFixedShifts = useCallback(
    async (shiftsToFix: Shift[]) => {
      if (shiftsToFix.length === 0) return false;
      try {
        const formData = new FormData();
        formData.append(
          "shift_ids",
          JSON.stringify(shiftsToFix?.map((s) => s.id))
        );
        let response = await ShiftService.fixedShifts(formData);
        if (response.status === "success") {
          const updatedShifts = globalShifts.map((s) =>
            shiftsToFix.some((selected) => selected.id === s.id)
              ? { ...s, status: "FIXED" as STATUS }
              : s
          );
          setGlobalShifts(updatedShifts);
          updateWeeklyShiftStatus(
            shiftsToFix.map((shift) => shift.id),
            "FIXED"
          );
          clearSelectedShifts("global");
          toast.success(
            response.message || "Shifts updated to FIXED successfully"
          );
          await refetch();
          return true;
        }
        return false;
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to update shifts to FIXED");
        console.error("Error updating shifts to FIXED:", error);
        return false;
      }
    },
    [
      globalShifts,
      setGlobalShifts,
      clearSelectedShifts,
      updateWeeklyShiftStatus,
      refetch,
    ]
  );

  const handlePlannedShifts = useCallback(
    async (shiftsToPlanned: Shift[]) => {
      if (shiftsToPlanned.length === 0) return false;
      try {
        const formData = new FormData();
        formData.append(
          "shift_ids",
          JSON.stringify(shiftsToPlanned?.map((s) => s.id))
        );
        let response = await ShiftService.plannedShifts(formData);
        if (response.status === "success") {
          const updatedShifts = globalShifts.map((s) =>
            shiftsToPlanned.some((selected) => selected.id === s.id)
              ? { ...s, status: "PLANNED" as STATUS }
              : s
          );
          setGlobalShifts(updatedShifts);
          updateWeeklyShiftStatus(
            shiftsToPlanned.map((shift) => shift.id),
            "PLANNED"
          );
          clearSelectedShifts("global");
          toast.success(
            response.message || "Shifts updated to PLANNED successfully"
          );
          return true;
        }
        return false;
      } catch (error: any) {
        toast.error(
          error?.data?.message || "Failed to update shifts to PLANNED"
        );
        console.error("Error updating shifts to PLANNED:", error);
        return false;
      }
    },
    [
      globalShifts,
      setGlobalShifts,
      clearSelectedShifts,
      updateWeeklyShiftStatus,
    ]
  );

  const handleDeleteShift = useCallback(
    async (shiftsToDelete: Shift[]) => {
      if (shiftsToDelete.length === 0) return false;
      try {
        const formData = new FormData();
        formData.append(
          "shift_ids",
          JSON.stringify(shiftsToDelete?.map((s) => s.id))
        );
        let response = await ShiftService.deleteShift(formData);
        if (response.status === "success") {
          const updatedShifts = Array.isArray(globalShifts)
            ? globalShifts.filter(
                (s) => !shiftsToDelete.some((selected) => selected.id === s.id)
              )
            : [];
          setGlobalShifts(updatedShifts);
          removeShiftsFromWeekly(shiftsToDelete.map((shift) => shift.id));
          clearSelectedShifts("global");
          toast.success(response.message || "Shifts deleted successfully");
          return true;
        }
        return false;
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete shift");
        console.error("Error deleting shift:", error);
        return false;
      }
    },
    [globalShifts, setGlobalShifts, clearSelectedShifts, removeShiftsFromWeekly]
  );

  return {
    handleFixedShifts,
    handlePlannedShifts,
    handleDeleteShift,
  };
};

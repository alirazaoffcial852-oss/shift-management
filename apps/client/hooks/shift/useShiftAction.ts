import { useCallback } from "react";
import { useCalendar } from "./useCalendar";
import { Shift, ShiftTrain } from "@/types/shift";
import { useConfirmation } from "@/providers/ConfirmationProvider";
import { useTranslations } from "next-intl";
import { useShiftStatusActions } from "./useShiftStatusActions";
import { useRouter } from "next/navigation";

export const useShiftActions = (shift: Shift) => {
  const router = useRouter();
  const t = useTranslations("pages.calandar");
  const {
    handleEditShift,
    handleTimeSheet,
    handleMarkAsBilled,
    handleApproveShift,
    isEmployee,
  } = useCalendar();
  const { handleFixedShifts, handlePlannedShifts, handleDeleteShift } =
    useShiftStatusActions();

  const { showConfirmation } = useConfirmation();

  const handleDelete = useCallback(() => {
    showConfirmation({
      title: t("Actions.deleteShiftTitle"),
      description: t("Actions.deleteShiftDescription"),
      confirmText: t("Actions.deleteShiftConfirmText"),
      variant: "destructive",
      onConfirm: () => handleDeleteShift([shift]),
    });
  }, [shift, t, handleDeleteShift]);

  const handleFixShift = useCallback(() => {
    showConfirmation({
      title: t("Actions.fixShiftTitle"),
      description: t("Actions.fixShiftDescription"),
      confirmText: t("Actions.fixShiftConfirmText"),
      variant: "default",
      onConfirm: () => handleFixedShifts([shift]),
    });
  }, [shift, t, handleFixedShifts]);

  const handlePlannedShift = useCallback(() => {
    showConfirmation({
      title: t("Actions.plannedShiftTitle"),
      description: t("Actions.plannedShiftDescription"),
      confirmText: t("Actions.plannedShiftConfirmText"),
      variant: "default",
      onConfirm: () => handlePlannedShifts([shift]),
    });
  }, [shift, t, handlePlannedShifts]);

  const handleViewTrains = (shiftTrain: ShiftTrain[]) => {
    router.push("/shift-management/regular-shifts/trains");
    localStorage.setItem("trains", JSON.stringify(shiftTrain));
  };

  return {
    handleViewTrains,
    handleDelete,
    handleFixShift,
    handlePlannedShift,
    handleEditShift: useCallback(
      () => handleEditShift(shift),
      [shift, handleEditShift]
    ),
    handleTimeSheet: useCallback(
      () => handleTimeSheet([shift]),
      [shift, handleTimeSheet]
    ),
    handleMarkAsBilled: useCallback(
      () => handleMarkAsBilled(shift),
      [shift, handleMarkAsBilled]
    ),
    handleApproveShift: useCallback(
      () => handleApproveShift(shift),
      [shift, handleApproveShift]
    ),
    isEmployee,
  };
};

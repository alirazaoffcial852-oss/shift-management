import React from "react";
import { Shift } from "@/types/shift";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
} from "@workspace/ui/components/context-menu";
import { useCalendar } from "@/hooks/shift/useCalendar";
import { useConfirmation } from "@/providers/ConfirmationProvider";
import { ACTION_ICONS } from "@/constants/shift.constants";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

interface BulkShiftActionsProps {
  onOpenDialog: () => void;
  selectedShifts: Shift[];
}
export const BulkShiftActions = ({
  onOpenDialog,
  selectedShifts,
}: BulkShiftActionsProps) => {
  const t = useTranslations("pages.calandar.Actions");

  const {
    handleEditShifts,
    handlePlannedShifts,
    handleDeleteShift,
    handleFixedShifts,
    handleTimeSheet,
    handleHandoverBook,
    isEmployee,
  } = useCalendar();
  const { showConfirmation } = useConfirmation();
  const { hasPermission } = usePermission();

  const plannedShifts = selectedShifts.filter(
    (shift: Shift) => shift.status === "PLANNED"
  );
  const FixedShifts = selectedShifts.filter(
    (shift: Shift) => shift.status === "FIXED"
  );
  const fixedShiftsWithoutHandover = FixedShifts.filter(
    (shift: Shift) => !shift.handover_books
  );
  const openShifts = selectedShifts.filter(
    (shift: Shift) => shift.status === "OPEN"
  );

  const handleBulkDelete = () => {
    showConfirmation({
      title: t("delete_shifts"),
      description: `Are you sure you want to delete ${selectedShifts.length} shift(s)?`,
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: () => handleDeleteShift(selectedShifts),
    });
  };

  const handleBulkFix = () => {
    showConfirmation({
      title: t("fix_shifts"),
      description: `Are you sure you want to fix ${plannedShifts.length} shift(s)?`,
      confirmText: "Fix",
      variant: "default",
      onConfirm: () => handleFixedShifts(plannedShifts),
    });
  };
  const handleBulkPlanned = () => {
    showConfirmation({
      title: t("planned_shifts"),
      description: `Are you sure you want to planned ${openShifts.length} shift(s)?`,
      confirmText: "Planned",
      variant: "default",
      onConfirm: () => handlePlannedShifts(openShifts),
    });
  };

  return (
    <ContextMenuContent className="w-64">
      {!isEmployee && hasPermission("shift.update") && (
        <ContextMenuItem onClick={() => handleEditShifts(selectedShifts)}>
          <ACTION_ICONS.edit.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
          />
          {t("edit_shifts")}
        </ContextMenuItem>
      )}

      {FixedShifts.length > 0 && hasPermission("timesheet.create") && (
        <ContextMenuItem onClick={() => handleTimeSheet(FixedShifts)}>
          <ACTION_ICONS.timesheet.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.timesheet.color}`}
          />
          {t("create_timeSheet")}
        </ContextMenuItem>
      )}
      {fixedShiftsWithoutHandover.length > 0 &&
        hasPermission("handover-book.create") && (
          <ContextMenuItem
            onClick={() => handleHandoverBook(fixedShiftsWithoutHandover)}
          >
            <ACTION_ICONS.timesheet.icon
              className={`mr-2 h-4 w-4 ${ACTION_ICONS.timesheet.color}`}
            />
            Handover Book Document
          </ContextMenuItem>
        )}
      {!isEmployee && hasPermission("shift.update") && (
        <ContextMenuItem onClick={() => onOpenDialog()}>
          <ACTION_ICONS.assign.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.assign.color}`}
          />
          {t("assign_shifts")}
        </ContextMenuItem>
      )}
      {!isEmployee && hasPermission("shift.delete") && (
        <ContextMenuItem onClick={handleBulkDelete}>
          <ACTION_ICONS.delete.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.delete.color}`}
          />
          {t("delete_shifts")}
        </ContextMenuItem>
      )}
      {!isEmployee && plannedShifts.length > 0 && (
        <ContextMenuItem onClick={handleBulkFix}>
          <ACTION_ICONS.fix.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.fix.color}`}
          />
          {t("fix_shifts")}
        </ContextMenuItem>
      )}
      {!isEmployee && openShifts.length > 0 && (
        <ContextMenuItem onClick={handleBulkPlanned}>
          <ACTION_ICONS.fix.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.fix.color}`}
          />
          {t("planned_shifts")}
        </ContextMenuItem>
      )}
    </ContextMenuContent>
  );
};

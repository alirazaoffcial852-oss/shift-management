import React from "react";
import { ProjectUSNShift } from "@/types/projectUsn";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
} from "@workspace/ui/components/context-menu";
import { useConfirmation } from "@/providers/ConfirmationProvider";
import { ACTION_ICONS } from "@/constants/shift.constants";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/appProvider";
import { usePermission } from "@/hooks/usePermission";

interface BulkUSNShiftActionsProps {
  selectedShifts: ProjectUSNShift[];
  handleFixedShifts: (shifts: ProjectUSNShift[]) => Promise<boolean>;
  handlePlannedShifts: (shifts: ProjectUSNShift[]) => Promise<boolean>;
  handleDeleteShift: (shifts: ProjectUSNShift[]) => void;
  handleTimeSheet: (shifts: ProjectUSNShift[]) => void;
  handleHandoverBook?: (shifts: ProjectUSNShift[]) => void;
  handleEditShifts?: (shifts: ProjectUSNShift[]) => void;
}

export const BulkUSNShiftActions = ({
  selectedShifts,
  handleFixedShifts,
  handlePlannedShifts,
  handleDeleteShift,
  handleTimeSheet,
  handleHandoverBook,
  handleEditShifts,
}: BulkUSNShiftActionsProps) => {
  const t = useTranslations("pages.calandar.Actions");
  const { showConfirmation } = useConfirmation();
  const { isEmployee } = useAuth();
  const { hasPermission } = usePermission();

  const plannedShifts = selectedShifts.filter(
    (shift: ProjectUSNShift) => shift.status === "PLANNED"
  );
  const fixedShifts = selectedShifts.filter(
    (shift: ProjectUSNShift) => shift.status === "FIXED"
  );
  const fixedShiftsWithoutHandover = fixedShifts.filter(
    (shift: ProjectUSNShift) => !shift.usn_handover_book
  );
  const openShifts = selectedShifts.filter(
    (shift: ProjectUSNShift) => shift.status === "OPEN"
  );

  const handleBulkDelete = () => {
    showConfirmation({
      title: t("delete_shifts"),
      description: `Are you sure you want to delete ${selectedShifts.length} USN shift(s)?`,
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: () => handleDeleteShift(selectedShifts),
    });
  };

  const handleBulkFix = () => {
    showConfirmation({
      title: t("fix_shifts"),
      description: `Are you sure you want to fix ${plannedShifts.length} USN shift(s)?`,
      confirmText: "Fix",
      variant: "default",
      onConfirm: () => handleFixedShifts(plannedShifts),
    });
  };

  const handleBulkPlanned = () => {
    showConfirmation({
      title: t("planned_shifts"),
      description: `Are you sure you want to plan ${openShifts.length} USN shift(s)?`,
      confirmText: "Planned",
      variant: "default",
      onConfirm: () => handlePlannedShifts(openShifts),
    });
  };

  return (
    <ContextMenuContent className="w-64">
      {!isEmployee && handleEditShifts && (
        <ContextMenuItem onClick={() => handleEditShifts(selectedShifts)}>
          <ACTION_ICONS.edit.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
          />
          {t("edit_shifts")}
        </ContextMenuItem>
      )}

      {fixedShifts.length > 0 && hasPermission("timesheet.create") && (
        <ContextMenuItem onClick={() => handleTimeSheet(fixedShifts)}>
          <ACTION_ICONS.timesheet.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.timesheet.color}`}
          />
          {t("create_timeSheet")}
        </ContextMenuItem>
      )}
      {fixedShiftsWithoutHandover.length > 0 &&
        handleHandoverBook &&
        hasPermission("usn-handover-book.create") && (
          <ContextMenuItem
            onClick={() => handleHandoverBook(fixedShiftsWithoutHandover)}
          >
            <ACTION_ICONS.timesheet.icon
              className={`mr-2 h-4 w-4 ${ACTION_ICONS.timesheet.color}`}
            />
            Handover Book Document
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

      {!isEmployee && hasPermission("usn-shift.delete") && (
        <ContextMenuItem onClick={handleBulkDelete}>
          <ACTION_ICONS.delete.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.delete.color}`}
          />
          {t("delete_shifts")}
        </ContextMenuItem>
      )}
    </ContextMenuContent>
  );
};

import React, { useMemo } from "react";
import { Shift } from "@/types/shift";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
} from "@workspace/ui/components/context-menu";
import { ACTION_ICONS } from "@/constants/shift.constants";
import { useShiftActions } from "@/hooks/shift/useShiftAction";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/appProvider";
import { toast } from "sonner";
import { usePermission } from "@/hooks/usePermission";

interface ShiftActionsProps {
  shift: Shift;
  setIsViewShiftOpen?: (isOpen: boolean) => void;
  setAssignDialog: (isOpen: boolean) => void;
  setSelectedAssignShifts: (shifts: Shift[]) => void;
  allShifts: Shift[];
}

export const ShiftActions = ({
  shift,
  setIsViewShiftOpen,
  setAssignDialog,
  setSelectedAssignShifts,
  allShifts,
}: ShiftActionsProps) => {
  const {
    handleDelete,
    handleFixShift,
    handlePlannedShift,
    handleEditShift,
    handleTimeSheet,
    handleMarkAsBilled,
    handleApproveShift,
    handleViewTrains,
    isEmployee,
  } = useShiftActions(shift);
  const t = useTranslations("pages.calandar.Actions");
  const router = useRouter();
  const { hasPermission } = usePermission();

  const { hasTrainDriver } = useAuth();

  const commonActions = useMemo(
    () => (
      <>
        <ContextMenuItem
          onClick={() =>
            router.push(`/shift-management/regular-shifts/monthly/${shift.id}`)
          }
        >
          <ACTION_ICONS.view.icon
            className={`mr-2 h-4 w-4 ${ACTION_ICONS.view.color}`}
          />
          {t("viewShift")}
        </ContextMenuItem>

        {!isEmployee && hasPermission("shift.delete") && (
          <ContextMenuItem onClick={handleDelete}>
            <ACTION_ICONS.delete.icon
              className={`mr-2 h-4 w-4 ${ACTION_ICONS.delete.color}`}
            />
            {t("delete_shift")}
          </ContextMenuItem>
        )}
      </>
    ),
    [isEmployee, setIsViewShiftOpen, handleDelete, t]
  );

  const statusSpecificActions = useMemo(() => {
    const handleAssign = () => {
      if (!shift.product_id) {
        toast.error(
          "Please select a product for this shift before assigning personnel"
        );
        return;
      }

      setSelectedAssignShifts([JSON.parse(JSON.stringify(shift))]);
      setAssignDialog(true);
    };

    switch (shift.status.toLowerCase()) {
      case "offer":
        return (
          !isEmployee && (
            <>
              {hasPermission("shift.update") && (
              <ContextMenuItem onClick={handleEditShift}>
                <ACTION_ICONS.edit.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
                />
                {t("edit_shift")}
              </ContextMenuItem>
              )}
              <ContextMenuItem onClick={handlePlannedShift}>
                <ACTION_ICONS.edit.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
                />
                {t("planned_shift")}
              </ContextMenuItem>
              <ContextMenuItem onClick={handleAssign}>
                <ACTION_ICONS.assign.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.assign.color}`}
                />
                {t("assign_shift")}
              </ContextMenuItem>
            </>
          )
        );

      case "open":
        return (
          !isEmployee && (
            <>
              {hasPermission("shift.update") && (
              <ContextMenuItem onClick={handleEditShift}>
                <ACTION_ICONS.edit.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
                />
                {t("edit_shift")}
              </ContextMenuItem>
              )}
              <ContextMenuItem onClick={handlePlannedShift}>
                <ACTION_ICONS.edit.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
                />
                {t("planned_shift")}
              </ContextMenuItem>
              <ContextMenuItem onClick={handleAssign}>
                <ACTION_ICONS.assign.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.assign.color}`}
                />
                {t("assign_shift")}
              </ContextMenuItem>
            </>
          )
        );

      case "planned":
        return (
          !isEmployee && (
            <>
              <ContextMenuItem onClick={handleEditShift}>
                <ACTION_ICONS.edit.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
                />
                {t("edit_shift")}
              </ContextMenuItem>
              <ContextMenuItem onClick={handleFixShift}>
                <ACTION_ICONS.fix.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.fix.color}`}
                />
                {t("change_to_fixed")}
              </ContextMenuItem>
              <ContextMenuItem onClick={handleAssign}>
                <ACTION_ICONS.assign.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.assign.color}`}
                />
                {t("Re_assign_shift")}
              </ContextMenuItem>
            </>
          )
        );

      case "fixed":
        return (
          <>
            {isEmployee && hasTrainDriver && (
              <ContextMenuItem
                onClick={() => handleViewTrains(shift.shiftTrain || [])}
              >
                <ACTION_ICONS.view.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.view.color}`}
                />
                View Trains
              </ContextMenuItem>
            )}

            {hasPermission("timesheet.create") && (
            <ContextMenuItem onClick={handleTimeSheet}>
              <ACTION_ICONS.timesheet.icon
                className={`mr-2 h-4 w-4 ${ACTION_ICONS.timesheet.color}`}
              />
              {t("add_time_sheet")}
            </ContextMenuItem>
            )}
            {!shift.handover_books && hasPermission("handover-book.create") && (
              <ContextMenuItem
                onClick={() => {
                  localStorage.setItem(
                    "selectedShifts",
                    JSON.stringify([shift])
                  );
                  router.push("/handover-book/add");
                }}
              >
                <ACTION_ICONS.timesheet.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.timesheet.color}`}
                />
                Handover Book Document
              </ContextMenuItem>
            )}
            {!isEmployee && (
              <>
                {hasPermission("shift.update") && (
                <ContextMenuItem onClick={handleEditShift}>
                  <ACTION_ICONS.edit.icon
                    className={`mr-2 h-4 w-4 ${ACTION_ICONS.edit.color}`}
                  />
                  {t("edit_shift")}
                </ContextMenuItem>
                )}
                {hasPermission("shift.update") && (
                <ContextMenuItem onClick={handleAssign}>
                  <ACTION_ICONS.assign.icon
                    className={`mr-2 h-4 w-4 ${ACTION_ICONS.assign.color}`}
                  />
                  {t("Re_assign_shift")}
                </ContextMenuItem>
                )}
              </>
            )}
          </>
        );

      case "submitted":
        return (
          !isEmployee && (
            <>
              <ContextMenuItem onClick={handleMarkAsBilled}>
                <ACTION_ICONS.bill.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.bill.color}`}
                />
                {t("mark_as_billed")}
              </ContextMenuItem>
              <ContextMenuItem onClick={handleApproveShift}>
                <ACTION_ICONS.approve.icon
                  className={`mr-2 h-4 w-4 ${ACTION_ICONS.approve.color}`}
                />
                {t("approve_shift")}
              </ContextMenuItem>
            </>
          )
        );

      case "billed":
        return null;

      default:
        return <ContextMenuItem disabled>No actions available</ContextMenuItem>;
    }
  }, [
    shift,
    isEmployee,
    handleEditShift,
    handlePlannedShift,
    handleFixShift,
    handleTimeSheet,
    handleMarkAsBilled,
    handleApproveShift,
    setAssignDialog,
    setSelectedAssignShifts,
    allShifts,
    t,
    hasPermission,
  ]);

  return (
    <ContextMenuContent className="w-64">
      <ContextMenuLabel className="font-semibold">
        {t("shift_Actions")}
      </ContextMenuLabel>
      {commonActions}
      {statusSpecificActions}
    </ContextMenuContent>
  );
};

ShiftActions.displayName = "ShiftActions";

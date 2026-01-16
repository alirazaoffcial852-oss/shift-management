"use client";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  Pencil,
  UserPlus,
  CheckSquare,
  Plus,
} from "lucide-react";
import { Shift } from "@/types/shift";
import { useCalendar } from "@/hooks/shift/useCalendar";
import { useTranslations } from "next-intl";
import { CalendarFilters } from "./CalendarFilters";
import { useState } from "react";
import { useShift } from "@/providers/shiftProvider";
import { usePermission } from "@/hooks/usePermission";

interface CalendarActionsProps {
  selectedShiftsCount: number;
  selectedShifts: Shift[];
}

const CalendarActions = ({
  selectedShiftsCount,
  selectedShifts,
}: CalendarActionsProps) => {
  const {
    handleEditShifts,
    handleDeleteShift,
    handleTimeSheet,
    handleHandoverBook,
    handleFixedShifts,
    isEmployee,
    clearSelectedShifts,
    applyFilters,
    pathType,
    globalShifts,
    setSelectedShifts,
  } = useCalendar();
  const { data } = useShift();
  const router = useRouter();
  const t = useTranslations("pages.calandar.Actions");
  const [isOpen, setIsOpen] = useState(false);
  const { hasPermission } = usePermission();

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectAllShifts = () => {
    setSelectedShifts("global", [...globalShifts]);
  };

  const hasShiftsWithStatus = (status: string) => {
    return selectedShifts.some(
      (shift) =>
        shift.status && shift.status.toLowerCase() === status.toLowerCase()
    );
  };

  const showEditOption =
    hasShiftsWithStatus("open") ||
    hasShiftsWithStatus("planned") ||
    hasShiftsWithStatus("fixed");

  const showAssignOption = hasShiftsWithStatus("open");

  const PlannedShifts = selectedShifts.filter(
    (shift: Shift) => shift.status === "PLANNED"
  );
  const FixedShifts = selectedShifts.filter(
    (shift: Shift) => shift.status === "FIXED"
  );
  const FixedShiftsWithoutHandoverBook = FixedShifts.filter(
    (shift: Shift) => !shift.handover_books
  );

  return (
    <div>
      <div className="flex justify-end gap-4 items-center">
        {!isEmployee &&
          pathType === "monthly" &&
          globalShifts.length > 0 &&
          globalShifts.length !== selectedShifts.length && (
            <SMSButton
              variant="outline"
              className="text-[16px] h-[56px] px-6 font-semibold border-none shadow text-[#3E8258]"
              startIcon={<CheckSquare className="h-4 w-4" />}
              text={t("selectAll")}
              onClick={handleSelectAllShifts}
            />
          )}
        {selectedShiftsCount > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SMSButton
                variant="outline"
                className="text-[16px] h-[56px] px-6 font-semibold border-none shadow text-[#3E8258]"
                endIcon={<ChevronDown className="ml-2 h-4 w-4" />}
              >
                {t("bulkActions")}
              </SMSButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {FixedShifts.length > 0 && hasPermission("timesheet.create") && (
                <DropdownMenuItem onClick={() => handleTimeSheet(FixedShifts)}>
                  <Clock className="mr-2 h-4 w-4" />
                  {t("create_timeSheet")}
                </DropdownMenuItem>
              )}
              {FixedShiftsWithoutHandoverBook.length > 0 &&
                hasPermission("handover-book.create") && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleHandoverBook(FixedShiftsWithoutHandoverBook)
                    }
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Handover Book Document
                  </DropdownMenuItem>
                )}
              {PlannedShifts.length > 0 && (
                <DropdownMenuItem
                  onClick={() => handleFixedShifts(PlannedShifts)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {t("fix_shifts")}
                </DropdownMenuItem>
              )}

              {!isEmployee &&
                showEditOption &&
                hasPermission("shift.update") && (
                  <DropdownMenuItem
                    onClick={() => handleEditShifts(selectedShifts)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit_shifts")}
                  </DropdownMenuItem>
                )}
              {!isEmployee &&
                showEditOption &&
                hasPermission("shift.delete") && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteShift(selectedShifts)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("delete_shifts")}
                  </DropdownMenuItem>
                )}

              {!isEmployee &&
                showAssignOption &&
                hasPermission("shift.update") && (
                  <DropdownMenuItem
                    onClick={() => handleEditShifts(selectedShifts, "assign")}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("assign_shifts")}
                  </DropdownMenuItem>
                )}

              {!showEditOption &&
                !showAssignOption &&
                FixedShifts.length === 0 &&
                PlannedShifts.length === 0 && (
                  <DropdownMenuItem disabled>
                    {t("No_actions_available")}
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {selectedShifts.length > 0 && (
          <SMSButton
            variant="outline"
            className="text-[16px] h-[56px] px-6 font-semibold border-none shadow text-[#3E8258]"
            text={t("Reset") || "Reset"}
            onClick={() => {
              clearSelectedShifts("global");
            }}
          />
        )}{" "}
        {!isEmployee && pathType === "monthly" && (
          <SMSButton
            onClick={toggleFilters}
            startIcon={<Filter className="h-4 w-4" />}
            endIcon={
              isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )
            }
            variant="outline"
            className="text-[16px] h-[56px] px-6 font-semibold border-none shadow text-[#3E8258]"
            text={t("filters")}
          />
        )}
        {!isEmployee && hasPermission("shift.create") && (
          <SMSButton
            startIcon={<Plus className="h-4 w-4" />}
            className="text-[16px] h-[56px] px-6 font-semibold"
            text={t("create_shift")}
            onClick={() => router.push("/shift-management/regular-shifts/add")}
          />
        )}
      </div>
      {!isEmployee && (
        <CalendarFilters
          onApplyFilters={applyFilters}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
      )}
    </div>
  );
};

export default CalendarActions;

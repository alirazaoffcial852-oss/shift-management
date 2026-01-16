"use client";
import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Textarea } from "@workspace/ui/components/textarea";
import { Shift } from "@/types/shift";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { useAuth } from "@/providers/appProvider";
import { Timesheet } from "@/types/timeSheet";
import { useTranslations } from "next-intl";
import { TrainDetailsSection } from "./TrainDetailsSection";
import { WorkPerformancesSection } from "./WorkPerformancesSection";
import { ChangesSection } from "./ChangesSection";

interface ExtendedShift extends Shift {
  timesheets?: {
    [employeeId: string]: Timesheet;
  };
}

interface BasicInformationFormProps {
  shifts: ExtendedShift;
  employeeId: string;
  onUpdate: (employeeId: string, field: string, value: any) => void;
  errors: { [key: string]: string | { [key: string]: string } };
  isSubmitting: boolean;
  handleSubmit: (submit: boolean) => void;
  copyToAllShifts: (checked: boolean) => void;
  handleSignature: (signature: string) => void;
  signatureModalOpen: boolean;
  setSignatureModalOpen: (open: boolean) => void;
  toggleTimesheetEnabled: (employeeId: string, enabled: boolean) => void;
}

export const BasicInformationForm: React.FC<BasicInformationFormProps> = ({
  shifts,
  employeeId,
  onUpdate,
  errors,
  copyToAllShifts,
  toggleTimesheetEnabled,
}) => {
  const { user } = useAuth();
  const t = useTranslations("timesheet");
  let userRole = user?.role?.name;
  let isClient = userRole === "CLIENT";
  const timesheet = shifts.timesheets?.[employeeId];
  const employee = shifts.shiftRole?.find(
    (role) => role.employee_id.toString() === employeeId.toString()
  )?.employee;
  const maxBreakDuration = timesheet?.max_break_duration || "0";

  return (
    <div className="border p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold capitalize">
          {t("employee")} {employee?.name || t("employeeTimesheet")}
        </h3>
        {isClient && (
          <Checkbox
            checked={timesheet?.isEnabled || false}
            onCheckedChange={(checked) =>
              toggleTimesheetEnabled(employeeId, !!checked)
            }
          />
        )}
      </div>

      {(timesheet?.isEnabled || !isClient) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <SMSInput
                label={t("startTime")}
                type="time"
                value={timesheet?.start_time || ""}
                onChange={(e) => {
                  onUpdate(employeeId, "start_time", e.target.value);
                }}
                error={
                  typeof errors === "object" && "start_time" in errors
                    ? (errors.start_time as string)
                    : ""
                }
                required
              />
            </div>

            <div>
              <SMSInput
                label={t("endTime")}
                type="time"
                value={timesheet?.end_time || ""}
                onChange={(e) =>
                  onUpdate(employeeId, "end_time", e.target.value)
                }
                error={
                  typeof errors === "object" && "end_time" in errors
                    ? (errors.end_time as string)
                    : ""
                }
                required
              />
            </div>
          </div>
          <div>
            <SMSInput
              label={t("breakDuration", { maxBreakDuration })}
              type="number"
              value={timesheet?.break_duration || ""}
              onChange={(e) =>
                onUpdate(employeeId, "break_duration", e.target.value)
              }
              error={
                typeof errors[employeeId] === "object"
                  ? (errors[employeeId] as { break_duration: string })
                      .break_duration
                  : ""
              }
              required
              min="0"
              max={maxBreakDuration}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("breakDurationExceeded", { maxBreakDuration })}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="extra-hours"
              checked={timesheet?.has_extra_hours || false}
              onCheckedChange={(checked) =>
                onUpdate(employeeId, "has_extra_hours", checked)
              }
            />
            <Label htmlFor="extra-hours">{t("extraHours")}</Label>
          </div>

          {timesheet?.has_extra_hours && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SMSInput
                  label={t("extraHours")}
                  type="number"
                  value={timesheet?.extra_hours || 0}
                  onChange={(e) =>
                    onUpdate(employeeId, "extra_hours", Number(e.target.value))
                  }
                  error={
                    typeof errors[employeeId] === "object"
                      ? (errors[employeeId] as { extra_hours: string })
                          .extra_hours
                      : ""
                  }
                  min={0}
                />
              </div>
              <div>
                <Label
                  htmlFor="note"
                  className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1 "
                >
                  {t("extraHoursNote")}
                </Label>
                <Textarea
                  className="w-full min-h-[52px]  px-3 py-2 mt-2 text-gray-800 border rounded-lg focus:outline-none"
                  id="extra_hours_note"
                  value={timesheet?.extra_hours_note || ""}
                  onChange={(e) =>
                    onUpdate(employeeId, "extra_hours_note", e.target.value)
                  }
                  placeholder={t("addAnyAdditionalNotes")}
                />
                <p className="text-red-500 text-sm mt-1">
                  {(errors[employeeId] as { extra_hours_note: string })
                    .extra_hours_note || ""}
                </p>
              </div>
            </div>
          )}

          <div>
            <Label
              htmlFor="note"
              className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1 mb-2"
            >
              {t("note")}
            </Label>
            <Textarea
              className="w-full h-32 px-3 py-2 text-gray-800 border rounded-lg focus:outline-none"
              id="note"
              value={timesheet?.notes || ""}
              onChange={(e) => onUpdate(employeeId, "notes", e.target.value)}
              placeholder={t("addAnyAdditionalNotes")}
            />
            {typeof errors === "object" && (
              <p className="text-red-500 text-sm mt-1">
                {(errors?.notes as string) || ""}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="night-shift"
                checked={timesheet?.is_night_shift || false}
                onCheckedChange={(checked) =>
                  onUpdate(employeeId, "is_night_shift", checked)
                }
              />
              <Label htmlFor="night-shift">{t("nightShift")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="holiday"
                checked={timesheet?.is_holiday || false}
                onCheckedChange={(checked) =>
                  onUpdate(employeeId, "is_holiday", checked)
                }
              />
              <Label htmlFor="holiday">{t("holiday")}</Label>
            </div>
          </div>

          <div className="border-t pt-4 mt-4 space-y-6">
            <TrainDetailsSection
              trainDetails={
                timesheet?.train_details && timesheet.train_details.length > 0
                  ? timesheet.train_details
                  : [
                      {
                        train_no: "",
                        departure_location: "",
                        departure_time: "",
                        arrival_location: "",
                        arrival_time: "",
                        notice_of_completion: "",
                        remarks: "",
                      },
                    ]
              }
              onUpdate={(trainDetails) =>
                onUpdate(employeeId, "train_details", trainDetails)
              }
              errors={
                typeof errors === "object" && errors[employeeId]
                  ? (errors[employeeId] as any).train_details
                  : {}
              }
              shift={shifts}
            />

            <WorkPerformancesSection
              workPerformances={
                timesheet?.work_performances &&
                timesheet.work_performances.length > 0
                  ? timesheet.work_performances
                  : [
                      {
                        from: "",
                        to: "",
                        work_performance: "",
                      },
                    ]
              }
              onUpdate={(workPerformances) =>
                onUpdate(employeeId, "work_performances", workPerformances)
              }
              errors={
                typeof errors === "object" && errors[employeeId]
                  ? (errors[employeeId] as any).work_performances
                  : {}
              }
            />

            <ChangesSection
              changes={
                timesheet?.changes && timesheet.changes.length > 0
                  ? timesheet.changes
                  : [
                      {
                        from: "",
                        to: "",
                        changes: "",
                        changer: "",
                      },
                    ]
              }
              onUpdate={(changes) => onUpdate(employeeId, "changes", changes)}
              errors={
                typeof errors === "object" && errors[employeeId]
                  ? (errors[employeeId] as any).changes
                  : {}
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

"use client";
import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Timesheet } from "@/types/timeSheet";
import { useTranslations } from "next-intl";

interface EditTimesheetFormProps {
  timesheet: Timesheet;
  onUpdate: (field: string, value: any) => void;
  errors: { [key: string]: string };
}

export const EditTimesheetForm: React.FC<EditTimesheetFormProps> = ({
  timesheet,
  onUpdate,
  errors,
}) => {
  const t = useTranslations("timesheet");
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SMSInput
            label={t("startTime")}
            type="time"
            value={timesheet?.start_time || ""}
            onChange={(e) => onUpdate("start_time", e.target.value)}
            error={errors?.start_time}
            required
          />
        </div>

        <div>
          <SMSInput
            label={t("endTime")}
            type="time"
            value={timesheet?.end_time || ""}
            onChange={(e) => onUpdate("end_time", e.target.value)}
            error={errors?.end_time}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="extra-hours"
          checked={timesheet?.has_extra_hours || false}
          onCheckedChange={(checked) => onUpdate("has_extra_hours", checked)}
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
              onChange={(e) => onUpdate("extra_hours", Number(e.target.value))}
              error={errors?.extra_hours}
              min={0}
            />
          </div>
          <div>
            <Label htmlFor="extra_hours_note">{t("extraHoursNote")}</Label>
            <Textarea
              id="extra_hours_note"
              value={timesheet?.extra_hours_note || ""}
              onChange={(e) => onUpdate("extra_hours_note", e.target.value)}
              placeholder={t("addExtraHoursNote")}
            />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea
          id="notes"
          className="h-32"
          value={timesheet?.notes || ""}
          onChange={(e) => onUpdate("notes", e.target.value)}
          placeholder={t("addAnyAdditionalNotes")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="night-shift"
            checked={timesheet?.is_night_shift || false}
            onCheckedChange={(checked) => onUpdate("is_night_shift", checked)}
          />
          <Label htmlFor="night-shift">{t("nightShift")}</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="holiday"
            checked={timesheet?.is_holiday || false}
            onCheckedChange={(checked) => onUpdate("is_holiday", checked)}
          />
          <Label htmlFor="holiday">{t("holiday")}</Label>
        </div>
      </div>
    </div>
  );
};

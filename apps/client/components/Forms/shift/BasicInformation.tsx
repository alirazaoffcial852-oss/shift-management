"use client";
import { useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Plus, Trash2 } from "lucide-react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { IniateShift } from "@/types/shift";
import { BasicInformationFormProps } from "./types/form";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

export function BasicInformationForm({
  iniateShift,
  onUpdate,
  errors,
  onContinue,
  hideFooter = false,
}: BasicInformationFormProps) {
  const t = useTranslations("pages.shift");
  const [dateErrors, setDateErrors] = useState<{ [key: string]: string }>({});

  const handleAddMore = () => {
    onUpdate([
      ...iniateShift,
      {
        start_date: null,
        end_date: null,
        start_time: "",
        end_time: "",
        roundsCount: 1,
        showRounds: true,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    const newShifts = iniateShift.filter((_, i) => i !== index);
    onUpdate(newShifts);

    const newDateErrors = { ...dateErrors };
    delete newDateErrors[`shifts[${index}].end_date`];
    setDateErrors(newDateErrors);
  };

  const handleChange = (
    index: number,
    field: keyof IniateShift,
    value: string | string[] | boolean | Date | null
  ) => {
    const newShifts = [...iniateShift];
    const currentShift = newShifts[index];

    if (currentShift) {
      let stringValue: string | string[] | boolean = value as
        | string
        | string[]
        | boolean;
      if (value instanceof Date) {
        stringValue = format(value, "yyyy-MM-dd");
      } else if (value === null || value === undefined) {
        stringValue = "";
      } else if (
        typeof value === "string" &&
        (field === "start_date" || field === "end_date")
      ) {
        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime())) {
          stringValue = format(dateValue, "yyyy-MM-dd");
        }
      }

      if (
        field === "start_date" &&
        typeof stringValue === "string" &&
        stringValue
      ) {
        const startDate = new Date(stringValue);
        if (!isNaN(startDate.getTime())) {
          const sameDayFormatted = format(startDate, "yyyy-MM-dd");
          (currentShift.end_date as string) = sameDayFormatted;
        }
      }

      (currentShift[field] as typeof stringValue) = stringValue;
    }
    onUpdate(newShifts);

    if (field === "start_date" || field === "end_date") {
      const newDateErrors = { ...dateErrors };
      delete newDateErrors[`shifts[${index}].end_date`];
      setDateErrors(newDateErrors);
    }
  };

  const validateDates = (): boolean => {
    const newDateErrors: { [key: string]: string } = {};
    let isValid = true;

    iniateShift.forEach((shift, index) => {
      if (shift.start_date && shift.end_date) {
        const startDate = new Date(shift.start_date);
        const endDate = new Date(shift.end_date);

        if (endDate < startDate) {
          newDateErrors[`shifts[${index}].end_date`] = t("dateValidation");
          isValid = false;
        }
      }
    });

    setDateErrors(newDateErrors);
    return isValid;
  };

  const handleContinueWithValidation = () => {
    if (validateDates()) {
      onContinue();
    }
  };

  return (
    <div className="space-y-3">
      <h3>{t("addShiftHeading")}</h3>
      {iniateShift?.map((shift, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md border p-6">
          <div className="flex items-start justify-end">
            {iniateShift.length > 1 && (
              <Trash2
                className="h-5 w-5 cursor-pointer text-red-500"
                onClick={() => handleRemove(index)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SMSInput
              label={t("startDate")}
              type="date"
              value={shift?.start_date || ""}
              onChange={(e) =>
                handleChange(index, "start_date", e.target.value)
              }
              required
              error={errors[`shifts[${index}].start_date`]}
            />

            <SMSInput
              label={t("endDate")}
              type="date"
              value={shift?.end_date || ""}
              onChange={(e) => handleChange(index, "end_date", e.target.value)}
              required
              error={
                errors[`shifts[${index}].end_date`] ||
                dateErrors[`shifts[${index}].end_date`]
              }
            />

            <SMSInput
              label={t("startTime")}
              type="time"
              value={shift.start_time || ""}
              onChange={(e) =>
                handleChange(index, "start_time", e.target.value)
              }
              required
              error={errors[`shifts[${index}].start_time`]}
            />

            <SMSInput
              label={t("endTime")}
              type="time"
              value={shift.end_time || ""}
              onChange={(e) => handleChange(index, "end_time", e.target.value)}
              required
              error={errors[`shifts[${index}].end_time`]}
            />

            {shift?.showRounds && (
              <SMSInput
                label={t("rounds")}
                type="number"
                min="1"
                value={shift.roundsCount.toString()}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  handleChange(index, "roundsCount", value.toString());
                }}
                required
                error={errors[`shifts[${index}].roundsCount`]}
              />
            )}
          </div>
        </div>
      ))}

      {iniateShift[0]?.showRounds && (
        <div className="flex justify-center mt-6">
          <SMSButton
            type="button"
            variant="outline"
            startIcon={<Plus className="h-4 w-4" />}
            onClick={handleAddMore}
            className="flex items-center gap-2 bg-white border-0 w-80 rounded-lg text-[#3E8258] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          >
            <span>{t("addNewBox")}</span>
          </SMSButton>
        </div>
      )}

      {!hideFooter && (
        <div className="text-end mt-10">
          <SMSButton
            className="bg-black rounded-full w-full sm:w-auto"
            onClick={handleContinueWithValidation}
          >
            {t("continue")}
          </SMSButton>
        </div>
      )}
    </div>
  );
}

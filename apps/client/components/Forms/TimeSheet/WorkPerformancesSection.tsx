"use client";
import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Textarea } from "@workspace/ui/components/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { WorkPerformance } from "@/types/timeSheet";
import { useTranslations } from "next-intl";

interface WorkPerformancesSectionProps {
  workPerformances: WorkPerformance[];
  onUpdate: (workPerformances: WorkPerformance[]) => void;
  errors?: { [key: number]: { [key: string]: string } };
}

export const WorkPerformancesSection: React.FC<
  WorkPerformancesSectionProps
> = ({ workPerformances, onUpdate, errors = {} }) => {
  const t = useTranslations("timesheet");
  const handleInputChange = (
    index: number,
    field: keyof WorkPerformance,
    value: string
  ) => {
    const updated = [...workPerformances];
    updated[index] = {
      ...updated[index],
      [field]: value || "",
    } as WorkPerformance;
    onUpdate(updated);
  };

  const addWorkPerformance = () => {
    onUpdate([
      ...workPerformances,
      {
        from: "",
        to: "",
        work_performance: "",
      },
    ]);
  };

  const removeWorkPerformance = (index: number) => {
    if (workPerformances.length > 1) {
      const updated = workPerformances.filter((_, i) => i !== index);
      onUpdate(updated);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("workPerformances")}</h3>
        <button
          type="button"
          onClick={addWorkPerformance}
          className="flex items-center gap-2 rounded-full text-green-700 p-1 mr-3"
        >
          <PlusCircle size={30} />
        </button>
      </div>

      {workPerformances.map((performance, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t("workPerformance")} {index + 1}
            </span>
            {workPerformances.length > 1 && (
              <button
                type="button"
                onClick={() => removeWorkPerformance(index)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                aria-label={t("removeWorkPerformance")}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SMSInput
              label={t("from")}
              type="datetime-local"
              value={performance.from}
              onChange={(e) => handleInputChange(index, "from", e.target.value)}
              error={errors[index]?.from}
            />
            <SMSInput
              label={t("to")}
              type="datetime-local"
              value={performance.to}
              onChange={(e) => handleInputChange(index, "to", e.target.value)}
              error={errors[index]?.to}
            />
            <SMSInput
              label={t("worksPerformed")}
              className="md:col-span-2"
              value={performance.work_performance}
              onChange={(e) =>
                handleInputChange(index, "work_performance", e.target.value)
              }
              error={errors[index]?.work_performance}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

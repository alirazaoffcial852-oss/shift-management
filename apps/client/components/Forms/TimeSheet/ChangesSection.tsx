"use client";
import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Textarea } from "@workspace/ui/components/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { Change } from "@/types/timeSheet";
import { useTranslations } from "next-intl";

interface ChangesSectionProps {
  changes: Change[];
  onUpdate: (changes: Change[]) => void;
  errors?: { [key: number]: { [key: string]: string } };
}

export const ChangesSection: React.FC<ChangesSectionProps> = ({
  changes,
  onUpdate,
  errors = {},
}) => {
  const t = useTranslations("timesheet");
  const handleInputChange = (
    index: number,
    field: keyof Change,
    value: string
  ) => {
    const updated = [...changes];
    updated[index] = { ...updated[index], [field]: value || "" } as Change;
    onUpdate(updated);
  };

  const addChange = () => {
    onUpdate([
      ...changes,
      {
        from: "",
        to: "",
        changes: "",
        changer: "",
      },
    ]);
  };

  const removeChange = (index: number) => {
    if (changes.length > 1) {
      const updated = changes.filter((_, i) => i !== index);
      onUpdate(updated);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("changes")}</h3>
        <button
          type="button"
          onClick={addChange}
          className="flex items-center gap-2 rounded-full text-green-700 p-1 mr-3"
        >
          <PlusCircle size={30} />
        </button>
      </div>

      {changes.map((change, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t("change")} {index + 1}
            </span>
            {changes.length > 1 && (
              <button
                type="button"
                onClick={() => removeChange(index)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                aria-label={t("removeChange")}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SMSInput
              label={t("from")}
              type="datetime-local"
              value={change.from}
              onChange={(e) => handleInputChange(index, "from", e.target.value)}
              error={errors[index]?.from}
            />
            <SMSInput
              label={t("to")}
              type="datetime-local"
              value={change.to}
              onChange={(e) => handleInputChange(index, "to", e.target.value)}
              error={errors[index]?.to}
            />
            <SMSInput
              label={t("changes")}
              value={change.changer}
              onChange={(e) =>
                handleInputChange(index, "changer", e.target.value)
              }
              error={errors[index]?.changer}
              placeholder={t("enterChanger")}
              className="md:col-span-2"
            />
          </div>
          <div>
            <label className="font-medium text-gray-800 text-lg mb-2 block">
              {t("obstructionsDifficultiesChanges")}
            </label>
            <Textarea
              className="w-full min-h-[100px] px-3 py-2 text-gray-800 border rounded-lg focus:outline-none"
              value={change.changes}
              onChange={(e) =>
                handleInputChange(index, "changes", e.target.value)
              }
              placeholder={t("enterChanges")}
            />
            {errors[index]?.changes && (
              <p className="text-red-500 text-sm mt-1">
                {errors[index].changes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

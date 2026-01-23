import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";

interface PickupDateSectionProps {
  pickupDate?: string;
  onPickupDateChange?: (date: string) => void;
  t: (key: string) => string;
}

export const PickupDateSection: React.FC<PickupDateSectionProps> = ({
  pickupDate,
  onPickupDateChange,
  t,
}) => {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
      <div className="flex items-center gap-3">
        <label className="text-sm font-semibold text-blue-900 whitespace-nowrap">
          {t("pickup.label")}
        </label>
        <SMSInput
          type="date"
          value={pickupDate || ""}
          onChange={(e) => onPickupDateChange?.(e.target.value)}
          className="w-64"
          placeholder={t("pickup.placeholder")}
          required
        />
      </div>
    </div>
  );
};

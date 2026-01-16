"use client";

import React, { useMemo } from "react";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { EmployeeOption } from "@/types/projectUsn";
import { BREAK_INCLUDES_OPTIONS, NEARBY_OPTIONS } from "@/types/projectUsn";
import { useTranslations } from "next-intl";

interface PersonnelSectionProps {
  title: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  selectedEmployees: string[];
  onEmployeeSelect: (value: string) => void;
  employees: EmployeeOption[];
  loading: boolean;
  onSearch: (searchTerm: string) => void;
  breakIncludes: string;
  onBreakIncludesChange: (value: string) => void;
  nearby: string;
  onNearbyChange: (value: string) => void;
  error?: string;
}

const PersonnelSection: React.FC<PersonnelSectionProps> = ({
  title,
  enabled,
  onToggle,
  selectedEmployees,
  onEmployeeSelect,
  employees,
  loading,
  onSearch,
  breakIncludes,
  onBreakIncludesChange,
  nearby,
  onNearbyChange,
  error,
}) => {
  const t = useTranslations("pages.projectUsn.personnelSection");

  const breakIncludesOptions = useMemo(
    () =>
      BREAK_INCLUDES_OPTIONS.map((option) => ({
        ...option,
        label:
          option.value === "yes"
            ? t("breakIncludesOptions.yes")
            : t("breakIncludesOptions.no"),
      })),
    [t]
  );

  const nearbyOptions = useMemo(
    () =>
      NEARBY_OPTIONS.map((option) => ({
        ...option,
        label:
          option.value === "nearby"
            ? t("nearbyOptions.nearby")
            : t("nearbyOptions.farAway"),
      })),
    [t]
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center space-x-4 mb-4 min-w-max">
        <Label className="text-[22px] sm:text-[22px] font-semibold text-[#2D2E33] capitalize pl-2">
          {title}
        </Label>
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <p className="text-[10px] font-semibold">{t("showDetails")}</p>
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SMSCombobox
              label={`${title} *`}
              value={selectedEmployees}
              onValueChange={onEmployeeSelect}
              options={employees}
              error={error}
              loading={loading}
              multiple={true}
              onSearch={onSearch}
              className="w-full"
            />

            <SMSCombobox
              label={t("breakIncludesLabel")}
              value={breakIncludes}
              onValueChange={onBreakIncludesChange}
              options={breakIncludesOptions}
              className="w-full"
            />

            <SMSCombobox
              label={t("nearbyLabel")}
              value={nearby}
              onValueChange={onNearbyChange}
              options={nearbyOptions}
              className="w-full"
            />
          </div>
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PersonnelSection;

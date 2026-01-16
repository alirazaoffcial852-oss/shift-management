"use client";

import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { FormErrors, WagonFormData } from "@/types/wagon";
import { useTranslations } from "next-intl";

interface TechnicalPreparationsProps {
  formData: WagonFormData;
  errors: FormErrors;
  handleInputChange: (
    section: keyof WagonFormData,
    field: string,
    value: string
  ) => void;
  handleCheckboxChange: (
    section: keyof WagonFormData,
    field: string,
    subField?: string
  ) => void;
  handleRestrictionsChange: (
    section: "technicalPreparations",
    value: "no" | "yes"
  ) => void;
}

const TechnicalPreparations: React.FC<TechnicalPreparationsProps> = ({
  formData,
  errors,
  handleInputChange,
  handleCheckboxChange,
  handleRestrictionsChange,
}) => {
  const t = useTranslations("pages.wegonList");

  const getCheckboxError = (section: string) => {
    if (!errors.general) return false;
    return errors.general.includes(section);
  };

  const vdvError = getCheckboxError("VDV 757");
  const avvError = getCheckboxError("AVV");
  const restrictionsError = getCheckboxError("restriction");

  return (
    <section className="mb-6 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {t("TechnicalPreparations")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <SMSInput
          type="date"
          name="date"
          label={t("Date")}
          value={formData.technicalPreparations.date}
          onChange={(e) =>
            handleInputChange("technicalPreparations", "date", e.target.value)
          }
          required
          error={errors.date}
        />
        <SMSInput
          name="fromTime"
          label={t("FromTime")}
          type="time"
          value={formData.technicalPreparations.fromTime}
          onChange={(e) =>
            handleInputChange(
              "technicalPreparations",
              "fromTime",
              e.target.value
            )
          }
          required
          error={errors.fromTime}
        />
        <SMSInput
          name="toTime"
          label={t("ToTime")}
          type="time"
          value={formData.technicalPreparations.toTime}
          onChange={(e) =>
            handleInputChange("technicalPreparations", "toTime", e.target.value)
          }
          required
          error={errors.toTime}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {t("AsPerVDV")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vdv-level3a"
              checked={formData.technicalPreparations.vdvChecks.level3a}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "technicalPreparations",
                  "vdvChecks",
                  "level3a"
                )
              }
              data-invalid={vdvError}
            />
            <Label htmlFor="vdv-level3a">{t("Level3A")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="vdv-level3b"
              checked={formData.technicalPreparations.vdvChecks.level3b}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "technicalPreparations",
                  "vdvChecks",
                  "level3b"
                )
              }
              data-invalid={vdvError}
            />
            <Label htmlFor="vdv-level3b">{t("Level3B")}</Label>
          </div>
        </div>
        {vdvError && (
          <p className="text-red-500 text-sm mt-2">
            Please select at least one option
          </p>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {t("AsPerAVV")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="avv-zp"
              checked={formData.technicalPreparations.avvChecks.zp}
              onCheckedChange={() =>
                handleCheckboxChange("technicalPreparations", "avvChecks", "zp")
              }
              data-invalid={avvError}
            />
            <Label htmlFor="avv-zp">{t("ZP")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="avv-wu"
              checked={formData.technicalPreparations.avvChecks.wu}
              onCheckedChange={() =>
                handleCheckboxChange("technicalPreparations", "avvChecks", "wu")
              }
              data-invalid={avvError}
            />
            <Label htmlFor="avv-wu">{t("WU")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="avv-wsu"
              checked={formData.technicalPreparations.avvChecks.wsu}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "technicalPreparations",
                  "avvChecks",
                  "wsu"
                )
              }
              data-invalid={avvError}
            />
            <Label htmlFor="avv-wsu">{t("WSU")}</Label>
          </div>
        </div>
        {avvError && (
          <p className="text-red-500 text-sm mt-2">
            Please select at least one option
          </p>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {t("Restrictions")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tech-restriction-no"
              checked={formData.technicalPreparations.restrictions.no}
              onCheckedChange={() =>
                handleRestrictionsChange("technicalPreparations", "no")
              }
              data-invalid={restrictionsError}
            />
            <Label htmlFor="tech-restriction-no">{t("No")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tech-restriction-yes"
              checked={formData.technicalPreparations.restrictions.yes}
              onCheckedChange={() =>
                handleRestrictionsChange("technicalPreparations", "yes")
              }
              data-invalid={restrictionsError}
            />
            <Label htmlFor="tech-restriction-yes">{t("Yes")}</Label>
          </div>
        </div>
        {restrictionsError && (
          <p className="text-red-500 text-sm mt-2">
            Please select at least one option
          </p>
        )}
      </div>
    </section>
  );
};

export default TechnicalPreparations;

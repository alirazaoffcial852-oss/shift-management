"use client";

import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { FormErrors, WagonFormData } from "@/types/wagon";
import { useTranslations } from "next-intl";

interface BrakePreparationProps {
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
    section: "brakePreparation",
    value: "no" | "yes"
  ) => void;
}

const BrakePreparation: React.FC<BrakePreparationProps> = ({
  formData,
  errors,
  handleInputChange,
  handleCheckboxChange,
  handleRestrictionsChange,
}) => {
  const t = useTranslations("pages.wegonList");

  return (
    <section className="mb-6 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {t("BrakePreparation")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <SMSInput
          type="date"
          name="brakeDate"
          label={t("Date")}
          value={formData.brakePreparation.brakeDate}
          onChange={(e) =>
            handleInputChange("brakePreparation", "brakeDate", e.target.value)
          }
          required
          error={errors.brakeDate}
        />
        <SMSInput
          name="brakeFromTime"
          label={t("FromTime")}
          type="time"
          value={formData.brakePreparation.brakeFromTime}
          onChange={(e) =>
            handleInputChange(
              "brakePreparation",
              "brakeFromTime",
              e.target.value
            )
          }
          required
          error={errors.brakeFromTime}
        />
        <SMSInput
          name="brakeToTime"
          label={t("ToTime")}
          type="time"
          value={formData.brakePreparation.brakeToTime}
          onChange={(e) =>
            handleInputChange("brakePreparation", "brakeToTime", e.target.value)
          }
          required
          error={errors.brakeToTime}
        />
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {t("With") || "With"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="with-locomotive"
              checked={formData.brakePreparation.with.locomotive}
              onCheckedChange={() =>
                handleCheckboxChange("brakePreparation", "with", "locomotive")
              }
            />
            <Label htmlFor="with-locomotive">{t("Locomotive")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="with-shunting-locomotive"
              checked={formData.brakePreparation.with.shuntingLocomotive}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "with",
                  "shuntingLocomotive"
                )
              }
            />
            <Label htmlFor="with-shunting-locomotive">
              {t("ShuntingLocomotive")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="with-brake-testing-facilities"
              checked={formData.brakePreparation.with.brakeTestingFacilities}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "with",
                  "brakeTestingFacilities"
                )
              }
            />
            <Label htmlFor="with-brake-testing-facilities">
              {t("BrakeTestingFacilities")}
            </Label>
          </div>
        </div>
        {errors.general?.includes("'With' option") && (
          <p className="text-red-500 text-sm mb-2">
            Please select at least one option
          </p>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {t("AsPerVDV") || "As per VDV 757"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="none"
              checked={formData.brakePreparation.AsPerVDV757.none}
              onCheckedChange={() =>
                handleCheckboxChange("brakePreparation", "AsPerVDV757", "none")
              }
            />
            <Label htmlFor="none">{t("None")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="full-breaking-test"
              checked={formData.brakePreparation.AsPerVDV757.fullBreakingTest}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "AsPerVDV757",
                  "fullBreakingTest"
                )
              }
            />
            <Label htmlFor="full-breaking-test">{t("FullBreakingTest")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="simplified-breaking-test"
              checked={
                formData.brakePreparation.AsPerVDV757.simplifiedBreakingTest
              }
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "AsPerVDV757",
                  "simplifiedBreakingTest"
                )
              }
            />
            <Label htmlFor="simplified-breaking-test">
              {t("SimplifiedBreakingTest")}
            </Label>
          </div>
        </div>
        {errors.general?.includes("'As per VDV 757' option") && (
          <p className="text-red-500 text-sm mb-2">
            Please select at least one option
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="dangerous-goods"
            checked={formData.brakePreparation.dangerousGoods}
            onCheckedChange={() =>
              handleCheckboxChange("brakePreparation", "dangerousGoods")
            }
          />
          <Label htmlFor="dangerous-goods">{t("DangerousGoodsInTrain")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="extraordinary-shipments"
            checked={formData.brakePreparation.extraordinaryShipments}
            onCheckedChange={() =>
              handleCheckboxChange("brakePreparation", "extraordinaryShipments")
            }
          />
          <Label htmlFor="extraordinary-shipments">
            {t("ExtraordinaryShipmentsInTrain")}
          </Label>
        </div>
        {errors.general?.includes("'dangerous' option") && (
          <p className="text-red-500 text-sm mb-2">
            Please select at least one option
          </p>
        )}
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="brake-restriction-no"
              checked={formData.brakePreparation.restrictions.no}
              onCheckedChange={() =>
                handleRestrictionsChange("brakePreparation", "no")
              }
            />
            <Label htmlFor="brake-restriction-no">{t("No")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="brake-restriction-yes"
              checked={formData.brakePreparation.restrictions.yes}
              onCheckedChange={() =>
                handleRestrictionsChange("brakePreparation", "yes")
              }
            />
            <Label htmlFor="brake-restriction-yes">{t("Yes")}</Label>
          </div>
        </div>
        {errors.general?.includes(
          "restriction option in Brake Preparation"
        ) && (
          <p className="text-red-500 text-sm mb-2">
            Please select at least one option
          </p>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {t("Function")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auditor-level-3"
              checked={formData.brakePreparation.function.AuditorLevel3}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "function",
                  "AuditorLevel3"
                )
              }
            />
            <Label htmlFor="auditor-level-3">{t("AuditorLevel3")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auditor-level-4"
              checked={formData.brakePreparation.function.AuditorLevel4}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "function",
                  "AuditorLevel4"
                )
              }
            />
            <Label htmlFor="auditor-level-4">{t("AuditorLevel4")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wagonmaster"
              checked={formData.brakePreparation.function.Wagonmaster}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "function",
                  "Wagonmaster"
                )
              }
            />
            <Label htmlFor="wagonmaster">{t("Wagonmaster")}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wagonauditor"
              checked={formData.brakePreparation.function.Wagonauditor}
              onCheckedChange={() =>
                handleCheckboxChange(
                  "brakePreparation",
                  "function",
                  "Wagonauditor"
                )
              }
            />
            <Label htmlFor="wagonauditor">{t("Wagonauditor")}</Label>
          </div>
        </div>
        {errors.general?.includes("function option") && (
          <p className="text-red-500 text-sm mt-2">
            Please select at least one option
          </p>
        )}
      </div>
    </section>
  );
};

export default BrakePreparation;

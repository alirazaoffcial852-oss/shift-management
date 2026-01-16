import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Locomotive } from "@/types/locomotive";
import { useTranslations } from "next-intl";

interface FormFieldsProps {
  locomotive: Locomotive;
  errors: Record<string, string[]> | undefined;
  onInputChange: (field: string, value: string) => void;
}

export const LocomotiveFormFields: React.FC<FormFieldsProps> = ({
  locomotive,
  errors,
  onInputChange,
}) => {
  const t = useTranslations("pages.locomotives");

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      <SMSInput
        label={`${t("name")}`}
        value={locomotive.name}
        onChange={(e) => onInputChange("name", e.target.value)}
        required
        error={errors?.["name"]?.join(", ")}
        name="name"
      />
      <SMSInput
        label={`${t("model_type")}`}
        value={locomotive.model_type}
        onChange={(e) => onInputChange("model_type", e.target.value)}
        required
        error={errors?.["model_type"]?.join(", ")}
        name="model_type"
      />
      <SMSInput
        label={`${t("engine")}`}
        value={locomotive.engine}
        onChange={(e) => onInputChange("engine", e.target.value)}
        required
        error={errors?.engine?.join(", ")}
        name="engine"
      />
      <SMSInput
        label={`${t("year")}`}
        value={locomotive.year ?? ""}
        onChange={(e) => onInputChange("year", e.target.value)}
        required
        error={errors?.year?.join(", ")}
        name="year"
      />
    </div>
  );
};

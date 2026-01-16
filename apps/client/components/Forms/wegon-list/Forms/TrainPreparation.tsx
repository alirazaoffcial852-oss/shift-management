import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { FormErrors, WagonFormData } from "@/types/wagon";
import MapWithSearch from "@/components/Map";
import { useTranslations } from "next-intl";

interface TrainPreparationProps {
  formData: WagonFormData;
  errors: FormErrors;
  handleInputChange: (
    section: keyof WagonFormData,
    field: string,
    value: string
  ) => void;
}

const TrainPreparation: React.FC<TrainPreparationProps> = ({
  formData,
  errors,
  handleInputChange,
}) => {
  const t = useTranslations("pages.wegonList");

  return (
    <section className="mb-6 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {t("TrainPreparation")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <SMSInput
          type="text"
          name="locomotive"
          label={t("Locomotive")}
          value={formData.trainPreparation.locomotive || ""}
          onChange={(e) =>
            handleInputChange("trainPreparation", "locomotive", e.target.value)
          }
          required
          error={errors.locomotive}
          placeholder={t("Locomotive")}
          disabled
        />
        <MapWithSearch
          label={t("Location")}
          placeholder={t("EnterLocation")}
          value={formData.trainPreparation.location}
          onChange={(e) =>
            handleInputChange("trainPreparation", "location", e.target.value)
          }
          error={errors.location}
          disabled
        />
        <SMSInput
          name="railNumber"
          label={t("Rail")}
          placeholder={t("RailNumberPlaceholder")}
          type="number"
          value={formData.trainPreparation.railNumber.toString()}
          onChange={(e) =>
            handleInputChange("trainPreparation", "railNumber", e.target.value)
          }
          required
          error={errors.railNumber}
          min="1"
        />
      </div>
    </section>
  );
};

export default TrainPreparation;

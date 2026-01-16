"use client";
import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import SMSBackButton from "@workspace/ui/components/custom/SMSBackButton";
import { useLocationForm } from "@/hooks/location/useLocationForm";
import { LocationType } from "@/types/location";
import { useTranslations } from "next-intl";

interface LocationFormProps {
  id?: number;
  onclose?: () => void;
  isDialog?: boolean;
}

const LocationForm: React.FC<LocationFormProps> = ({
  id,
  onclose,
  isDialog = false,
}) => {
  const { location, errors, loading, handleInputChange, handleSubmit } =
    useLocationForm(id, onclose);

  const t = useTranslations("pages.locations");

  const typeOfLocationOptions = [
    { value: LocationType.WAREHOUSE, label: t("warehouse") },
    { value: LocationType.TARIF_POINT, label: t("tariffPoint") },
    { value: LocationType.SUPPLIER_PLANT, label: t("supplierPlant") },
  ];

  return (
    <div className=" bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex items-center mb-8">
          <SMSBackButton />

          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              {id ? t("editLocation") : t("addNewLocation")}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {t("locationInformation")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SMSInput
                label={t("locationName")}
                placeholder={t("enterLocationName")}
                value={location.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                error={errors.name}
                name="name"
                className="w-full"
              />
              <SMSInput
                label={t("location")}
                placeholder={t("enterLocation")}
                value={location.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                error={errors.location}
                name="location"
                className="w-full"
              />

              <SMSCombobox
                label={t("typeOfLocation")}
                placeholder={t("selectTypeOfLocation")}
                value={location.type}
                onValueChange={(value) => handleInputChange("type", value)}
                options={typeOfLocationOptions}
                required
                error={errors.type}
                className="w-full"
              />
            </div>
          </div>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}
          <div className="flex justify-end pt-6">
            <SMSButton
              type="submit"
              text={id ? t("updateLocation") : t("saveLocation")}
              className="bg-black text-white px-8"
              loading={loading}
              loadingText={id ? t("updatingLocation") : t("savingLocation")}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;

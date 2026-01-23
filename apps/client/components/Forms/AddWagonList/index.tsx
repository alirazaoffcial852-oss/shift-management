"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Label } from "@workspace/ui/components/label";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import SMSBackButton from "@workspace/ui/components/custom/SMSBackButton";
import { useWagonForm } from "@/hooks/wagon/useWagonForm";
import { useCompany } from "@/providers/appProvider";
import LocationService from "@/services/location";
import { Location } from "@/types/location";
import { wagonTypeDisplayNames } from "@/types/order";

interface AddWagonFormProps {
  id?: number;
  onClose?: () => void;
}

const AddWagonForm: React.FC<AddWagonFormProps> = ({ id, onClose }) => {
  const t = useTranslations("common");
  const tWagon = useTranslations("pages.wagon");
  const { company } = useCompany();

  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [locationPage, setLocationPage] = useState(1);
  const [locationTotalPages, setLocationTotalPages] = useState(1);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [loadingMoreLocations, setLoadingMoreLocations] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const {
    formData,
    brakeManualDetails,
    brakeAutoDetails,
    damageInformations,
    wagonRents,
    errors,
    loading,
    handleInputChange,
    handleBrakeManualChange,
    handleBrakeAutoChange,
    handleDamageChange,
    handleRentChange,
    handleSubmit,
  } = useWagonForm(id, onClose);

  const [showDamageNotes, setShowDamageNotes] = useState(false);

  useEffect(() => {
    if (company?.id) {
      const fetchInitialLocations = async () => {
        setLoadingLocations(true);
        try {
          const response = await LocationService.getAllLocations(
            1,
            20,
            company.id,
            "",
            ""
          );
          if (response?.data?.data) {
            setAllLocations(response.data.data);
            if (response.data.pagination) {
              setLocationTotalPages(response.data.pagination.total_pages || 1);
            }
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setLoadingLocations(false);
        }
      };
      fetchInitialLocations();
    }
  }, [company?.id]);

  const loadMoreLocations = useCallback(async () => {
    if (loadingMoreLocations || locationPage >= locationTotalPages || !company?.id) {
      return;
    }

    setLoadingMoreLocations(true);
    try {
      const nextPage = locationPage + 1;
      const response = await LocationService.getAllLocations(
        nextPage,
        20,
        company.id,
        locationSearchQuery,
        ""
      );

      if (response?.data?.data) {
        setAllLocations((prev) => [...prev, ...response.data.data]);
        setLocationPage(nextPage);
        if (response.data.pagination) {
          setLocationTotalPages(response.data.pagination.total_pages || 1);
        }
      }
    } catch (error) {
      console.error("Error loading more locations:", error);
    } finally {
      setLoadingMoreLocations(false);
    }
  }, [loadingMoreLocations, locationPage, locationTotalPages, company?.id, locationSearchQuery]);

  const handleLocationSearch = useCallback(
    async (searchQuery: string) => {
      if (!company?.id) return;

      setLocationSearchQuery(searchQuery);
      setLoadingMoreLocations(true);
      try {
        if (searchQuery === "") {
          const response = await LocationService.getAllLocations(1, 20, company.id, "", "");
          if (response?.data?.data) {
            setAllLocations(response.data.data);
            setLocationPage(1);
            if (response?.data?.pagination) {
              setLocationTotalPages(response.data.pagination.total_pages || 1);
            }
          }
        } else {
          const response = await LocationService.getAllLocations(
            1,
            20,
            company.id,
            searchQuery,
            ""
          );

          if (response?.data?.data) {
            setAllLocations(response.data.data);
            setLocationPage(1);
            if (response.data.pagination) {
              setLocationTotalPages(response.data.pagination.total_pages || 1);
            }
          }
        }
      } catch (error) {
        console.error("Error searching locations:", error);
      } finally {
        setLoadingMoreLocations(false);
      }
    },
    [company?.id]
  );

  useEffect(() => {
    if (id && allLocations.length > 0 && !formData.location_id) {
      const matchedLocation = allLocations.find(
        (loc) => loc.id === formData.location_id
      );
      if (matchedLocation) {
        handleInputChange("location_id", matchedLocation.id);
      }
    }
  }, [id, allLocations, formData.location_id, handleInputChange]);

  const formatWagonNumberDisplay = (value: string) => {
    if (!value) return "";

    const digitsOnly = value.replace(/\D/g, "");
    const parts = [];

    if (digitsOnly.length > 0) {
      parts.push(digitsOnly.slice(0, Math.min(2, digitsOnly.length)));
    }
    if (digitsOnly.length > 2) {
      parts.push(digitsOnly.slice(2, Math.min(4, digitsOnly.length)));
    }
    if (digitsOnly.length > 4) {
      parts.push(digitsOnly.slice(4, Math.min(8, digitsOnly.length)));
    }
    if (digitsOnly.length > 8) {
      parts.push(digitsOnly.slice(8, Math.min(11, digitsOnly.length)));
    }
    if (digitsOnly.length > 11) {
      parts.push(digitsOnly.slice(11, Math.min(12, digitsOnly.length)));
    }

    return parts.join(" ");
  };

  const handleWagonNumberChange = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, "").slice(0, 12);
    handleInputChange("wagon_number", digitsOnly);
  };

  const locationOptions = useMemo(
    () =>
      allLocations.map((location) => ({
        value: location.id.toString(),
        label: location.name || location.location,
      })),
    [allLocations]
  );

  const hasMoreLocations = locationPage < locationTotalPages;

  const wagonTypeOptions = wagonTypeDisplayNames.map((displayName) => ({
    label: displayName,
    value: displayName.toUpperCase(),
  }));

  const brakingTypeOptions = [
    { value: "K", label: "K" },
    { value: "L", label: "L" },
    { value: "LL", label: "LL" },
  ];

  const handleDateChange = (field: string, value: any) => {
    const dateString = value?.target?.value || "";

    if (field.startsWith("damage.")) {
      handleDamageChange(field.replace("damage.", "") as any, dateString);
    } else if (field.startsWith("rent.")) {
      handleRentChange(field.replace("rent.", "") as any, dateString);
    } else {
      handleInputChange(field as any, dateString);
    }
  };

  const isRevisionDueSoon = (date: string) => {
    if (!date) return false;
    const revisionDate = new Date(date);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return revisionDate <= threeMonthsFromNow;
  };

  const isRentExpiringSoon = (date: string) => {
    if (!date) return false;
    const rentEndDate = new Date(date);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return rentEndDate <= threeMonthsFromNow;
  };

  const getDamagedColor = (value: boolean) => {
    return value ? "red" : "green";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex items-center mb-8">
          <SMSBackButton />
          <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              {id ? t("edit_wagon") : t("add_new_wagon")}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SMSInput
                label={t("wagon_no")}
                placeholder="00 00 0000 000 0"
                value={formatWagonNumberDisplay(formData.wagon_number)}
                onChange={(e) => handleWagonNumberChange(e.target.value)}
                maxLength={16}
                inputMode="numeric"
                required
                error={errors.wagon_number}
              />

              <SMSCombobox
                label={tWagon("location")}
                placeholder={tWagon("enterLocation")}
                searchPlaceholder="Search location..."
                value={formData.location_id?.toString() || ""}
                onValueChange={(value) => {
                  const selectedLocation = allLocations.find(
                    (loc) => loc.id.toString() === value
                  );
                  if (selectedLocation) {
                    handleInputChange("location_id", Number(value));
                  }
                }}
                options={locationOptions}
                required
                error={errors.location_id}
                disabled={loadingLocations}
                hasMore={hasMoreLocations}
                loadingMore={loadingMoreLocations}
                onLoadMore={loadMoreLocations}
                onSearch={handleLocationSearch}
              />

              <SMSInput
                label={t("rail")}
                placeholder={t("enter_rail_number")}
                value={formData.rail}
                onChange={(e) => handleInputChange("rail", e.target.value)}
                error={errors.rail}
              />

              <SMSInput
                label={t("position")}
                placeholder={t("enter_position")}
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
                error={errors.position}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {t("damage_information")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SMSCombobox
                label={t("damaged")}
                placeholder={t("select_option")}
                value={formData.has_damage ? t("yes") : t("no")}
                onValueChange={(value) =>
                  handleInputChange("has_damage", value === t("yes"))
                }
                options={[
                  { value: t("yes"), label: t("yes") },
                  { value: t("no"), label: t("no") },
                ]}
                color={getDamagedColor(formData.has_damage)}
                required
                error={errors.has_damage}
              />

              {formData.has_damage && (
                <>
                  <SMSInput
                    type="date"
                    label={t("date_when_available_again")}
                    placeholder="DD/MM/YYYY"
                    value={damageInformations.date_when_available_again}
                    onChange={(e) =>
                      handleDateChange("damage.date_when_available_again", e)
                    }
                    error={errors["damage.date_when_available_again"]}
                  />

                  <div className="md:col-span-2 lg:col-span-3">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowDamageNotes(!showDamageNotes)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Info className="h-4 w-4 text-gray-500" />
                      </button>
                      <Label className="text-sm text-gray-600">
                        {t("add_notes_click_info_icon")}
                      </Label>
                    </div>

                    {showDamageNotes && (
                      <SMSInput
                        label={t("damage_notes")}
                        placeholder={t("enter_damage_notes")}
                        value={damageInformations.notes || ""}
                        onChange={(e) =>
                          handleDamageChange("notes", e.target.value)
                        }
                        error={errors["notes"]}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {t("wagon_type")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-3">
                <SMSCombobox
                  label={t("type_of_wagon")}
                  placeholder={t("select_wagon_type")}
                  value={formData.wagon_type}
                  onValueChange={(value) =>
                    handleInputChange("wagon_type", value)
                  }
                  options={wagonTypeOptions}
                  error={errors.wagon_type}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {t("technical_specifications")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SMSInput
                label={t("maximum_capacity_of_loading_weight")}
                placeholder={t("enter_weight_in_ton")}
                value={formData.maximun_capacity_of_load_weight}
                onChange={(e) =>
                  handleInputChange(
                    "maximun_capacity_of_load_weight",
                    e.target.value
                  )
                }
                type="number"
                error={errors.maximun_capacity_of_load_weight}
              />

              <SMSInput
                label={t("weight_of_the_wagon_itself")}
                placeholder={t("enter_weight_in_tons")}
                value={formData.weight_of_the_wagon_itself}
                onChange={(e) =>
                  handleInputChange(
                    "weight_of_the_wagon_itself",
                    e.target.value
                  )
                }
                type="number"
                error={errors.weight_of_the_wagon_itself}
              />

              <SMSInput
                label={t("weight_of_load")}
                value={formData.weight_of_load}
                onChange={(e) =>
                  handleInputChange("weight_of_load", e.target.value)
                }
                type="number"
                error={errors.weight_of_load}
              />

              <SMSCombobox
                label={t("braking_type")}
                placeholder={t("select_braking_type")}
                value={formData.braking_type}
                onValueChange={(value) =>
                  handleInputChange("braking_type", value)
                }
                options={brakingTypeOptions}
                error={errors.braking_type}
              />

              <SMSCombobox
                label={t("parking_brake")}
                placeholder={t("select_option")}
                value={formData.parking_brake ? t("yes") : t("no")}
                onValueChange={(value) =>
                  handleInputChange("parking_brake", value === t("yes"))
                }
                options={[
                  { value: t("yes"), label: t("yes") },
                  { value: t("no"), label: t("no") },
                ]}
                error={errors.parking_brake}
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                {t("braking_weight")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SMSCombobox
                  label={t("automatic_brake")}
                  placeholder={t("select_option")}
                  value={formData.has_automatic_brake ? t("yes") : t("no")}
                  onValueChange={(value) =>
                    handleInputChange("has_automatic_brake", value === t("yes"))
                  }
                  options={[
                    { value: t("yes"), label: t("yes") },
                    { value: t("no"), label: t("no") },
                  ]}
                  error={errors.has_automatic_brake}
                />

                {formData.has_automatic_brake ? (
                  <SMSInput
                    label={t("maximum_braking_weight")}
                    placeholder={t("enter_maximum_braking_weight")}
                    value={brakeAutoDetails.maximum_braking_weight}
                    onChange={(e) =>
                      handleBrakeAutoChange(
                        "maximum_braking_weight",
                        e.target.value
                      )
                    }
                    type="number"
                    error={errors["brakeAuto.maximum_braking_weight"]}
                  />
                ) : (
                  <>
                    <SMSInput
                      label={t("empty_braking_weight")}
                      placeholder={t("enter_empty_braking_weight")}
                      value={brakeManualDetails.empty_braking_weight}
                      onChange={(e) =>
                        handleBrakeManualChange(
                          "empty_braking_weight",
                          e.target.value
                        )
                      }
                      type="number"
                      error={errors["brakeManual.empty_braking_weight"]}
                    />
                    <SMSInput
                      label={t("full_braking_weight")}
                      placeholder={t("enter_full_braking_weight")}
                      value={brakeManualDetails.full_braking_weight}
                      onChange={(e) =>
                        handleBrakeManualChange(
                          "full_braking_weight",
                          e.target.value
                        )
                      }
                      type="number"
                      error={errors["brakeManual.full_braking_weight"]}
                    />
                    <SMSInput
                      label={t("conversion_weight")}
                      placeholder={t("enter_conversion_weight")}
                      value={brakeManualDetails.conversion_weight}
                      onChange={(e) =>
                        handleBrakeManualChange(
                          "conversion_weight",
                          e.target.value
                        )
                      }
                      type="number"
                      error={errors["brakeManual.conversion_weight"]}
                    />
                  </>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  {t("length_over_buffer")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="my-6">
                    <SMSInput
                      label={t("length_over_buffer")}
                      placeholder={t("enter_length")}
                      value={formData.length_over_buffer}
                      onChange={(e) =>
                        handleInputChange("length_over_buffer", e.target.value)
                      }
                      error={errors.length_over_buffer}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  {t("axles")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="my-6">
                    <SMSInput
                      label={t("loaded_axles")}
                      placeholder={t("enter_loaded_axles")}
                      value={formData.loaded_axles}
                      onChange={(e) =>
                        handleInputChange("loaded_axles", e.target.value)
                      }
                      type="number"
                      error={errors.loaded_axles}
                    />
                  </div>

                  <div className="my-6">
                    <SMSInput
                      label={t("empty_axles")}
                      placeholder={t("enter_empty_axles")}
                      value={formData.empty_axles}
                      onChange={(e) =>
                        handleInputChange("empty_axles", e.target.value)
                      }
                      type="number"
                      error={errors.empty_axles}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {t("revision")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SMSInput
                type="date"
                label={t("last_revision_date")}
                placeholder="DD/MM/YYYY"
                value={formData.last_revision_date}
                onChange={(e) => handleDateChange("last_revision_date", e)}
                error={errors.last_revision_date}
              />

              <div className="relative">
                <SMSInput
                  type="date"
                  label={t("next_revision_date")}
                  placeholder="DD/MM/YYYY"
                  value={formData.next_revision_date}
                  onChange={(e) => handleDateChange("next_revision_date", e)}
                  error={errors.next_revision_date}
                />
                {isRevisionDueSoon(formData.next_revision_date) && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              {t("rented")}
            </h2>

            <div className="space-y-6">
              <SMSCombobox
                label={t("rented")}
                placeholder={t("select_option")}
                value={formData.has_rent ? t("yes") : t("no")}
                onValueChange={(value) =>
                  handleInputChange("has_rent", value === t("yes"))
                }
                options={[
                  { value: t("yes"), label: t("yes") },
                  { value: t("no"), label: t("no") },
                ]}
                error={errors.has_rent}
              />

              {formData.has_rent && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <SMSInput
                    label={t("amount")}
                    placeholder={t("enter_amount")}
                    value={wagonRents.amount}
                    onChange={(e) => handleRentChange("amount", e.target.value)}
                    error={errors["rent.amount"]}
                  />
                  <SMSInput
                    type="date"
                    label={t("rent_from_date")}
                    placeholder="DD/MM/YYYY"
                    value={wagonRents.from}
                    onChange={(e) => handleDateChange("rent.from", e)}
                    error={errors["rent.from"]}
                  />

                  <div className="relative">
                    <SMSInput
                      type="date"
                      label={t("rent_to_date")}
                      placeholder="DD/MM/YYYY"
                      value={wagonRents.to}
                      onChange={(e) => handleDateChange("rent.to", e)}
                      error={errors["rent.to"]}
                    />
                    {isRentExpiringSoon(wagonRents.to) && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <SMSButton
              type="submit"
              text={
                loading ? t("saving") : id ? t("buttons.update") : tWagon("add")
              }
              className="bg-black text-white px-8"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWagonForm;

"use client";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { useCustomerForm } from "@/hooks/customer/useCustomerForm";
import { CountryCitySection } from "./CountryCitySection";
import { useTranslations } from "next-intl";
import { FORMMODE } from "@/types/shared/global";
import { useCallback } from "react";
import MapWithSearch from "@/components/Map";
import http from "@workspace/ui/lib/http";
import { City } from "@workspace/ui/types/city";
import { Country } from "@workspace/ui/types/country";
import { Customer } from "@/types/customer";

interface CustomerFormProps {
  useComponentAs: FORMMODE;
  id?: string;
  onclose?: () => void;
  isDialog?: boolean;
}
const CustomerForm: React.FC<CustomerFormProps> = ({
  useComponentAs,
  id,
  onclose,
  isDialog = false,
}) => {
  const {
    customers,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    locationData,
    setLocationData,
  } = useCustomerForm(Number(id), onclose);
  const t = useTranslations("common.labels");
  const tcommon = useTranslations("common");
  const tcustomer = useTranslations("pages.customers");

  const fetchCountry = useCallback(
    async (searchTerm?: string): Promise<Country | null> => {
      if (!searchTerm) return null;

      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "1",
          search: searchTerm,
        });
        const response = await http.get(`/countries?${params.toString()}`);
        const country = (response.data?.data || [])[0] as Country | undefined;
        return country ?? null;
      } catch (error) {
        console.error("Failed to fetch country", error);
        return null;
      }
    },
    []
  );

  const ensureAddressComponents = useCallback(
    async (place: google.maps.places.PlaceResult) => {
      if (place.address_components?.length) {
        return place.address_components;
      }

      if (!place.place_id || typeof window === "undefined" || !google?.maps) {
        return [];
      }

      return await new Promise<google.maps.GeocoderAddressComponent[]>(
        (resolve) => {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ placeId: place.place_id }, (results, status) => {
            if (status === "OK" && results?.[0]?.address_components) {
              resolve(results[0].address_components);
            } else {
              resolve([]);
            }
          });
        }
      );
    },
    []
  );

  const fetchCityByName = async (countryId: number, name?: string) => {
    if (!name) return null;
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "1",
        search: name,
      });
      const response = await http.get(
        `/countries/${countryId}/cities?${params.toString()}`
      );
      const city = (response.data?.data || [])[0] as City | undefined;
      return city ?? null;
    } catch (error) {
      console.error("Failed to resolve city from Google place", error);
      return null;
    }
  };

  const handleGooglePlaceSelect = async ({
    place,
    value,
  }: {
    place: google.maps.places.PlaceResult;
    value: string;
  }) => {
    // Update address immediately to clear address error
    handleInputChange("address", value);

    const addressComponents = await ensureAddressComponents(place);
    const findComponent = (types: string[]) =>
      addressComponents.find((component) =>
        types.some((type) => component.types.includes(type))
      );

    const countryComponent = findComponent(["country"]);
    const countryCode = countryComponent?.short_name?.toUpperCase();
    const countryName = countryComponent?.long_name;
    const resolvedCountry =
      (await fetchCountry(countryCode)) ||
      (await fetchCountry(countryName || ""));

    const postal =
      findComponent(["postal_code"])?.long_name ||
      findComponent(["postal_code_suffix"])?.long_name ||
      "";

    const cityName =
      findComponent([
        "locality",
        "postal_town",
        "administrative_area_level_2",
        "administrative_area_level_1",
      ])?.long_name || "";

    // Update postal code if found
    if (postal) {
      handleInputChange("postal_code", postal);
    }

    // Update country if found
    if (resolvedCountry) {
      handleInputChange("country", resolvedCountry.id);

      // Update city if found
      const resolvedCity = await fetchCityByName(resolvedCountry.id, cityName);
      if (resolvedCity) {
        handleInputChange("city", resolvedCity.id);

        // Update locationData for CountryCitySection to show selected values
        setLocationData({
          country: resolvedCountry,
          city: resolvedCity,
        });
      } else if (resolvedCountry) {
        // Update locationData with country only if city not found
        setLocationData({
          country: resolvedCountry,
          city: locationData?.city || ({} as City),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_for_project_usn_only"
            checked={customers.is_for_project_usn_only || false}
            onCheckedChange={(checked) =>
              handleInputChange("is_for_project_usn_only", checked as boolean)
            }
          />
          <Label
            htmlFor="is_for_project_usn_only"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {tcommon("is_for_project_usn_only")}
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ap-4 md:gap-6">
        <SMSInput
          label={t("name")}
          placeholder={t("name")}
          value={customers.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
          error={errors.name}
          name="name"
          className="w-full"
        />
        <SMSInput
          label={t("email")}
          placeholder={t("email")}
          value={customers.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
          error={errors.email}
          name="email"
          className="w-full"
        />

        <SMSInput
          label={t("phone")}
          placeholder={t("phone")}
          value={customers.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          required
          error={errors.phone}
          name="phone"
          type="tel"
          className="w-full"
        />

        <SMSInput
          label={tcustomer("contact_person")}
          placeholder={tcustomer("contact_person")}
          value={customers.contact_person_name}
          onChange={(e) =>
            handleInputChange("contact_person_name", e.target.value)
          }
          required
          error={errors.contact_person_name}
          name="contact_person"
          className="w-full"
        />

        <SMSInput
          label={tcustomer("contact_person_phone")}
          placeholder={tcustomer("contact_person")}
          value={customers.contact_person_phone}
          onChange={(e) =>
            handleInputChange("contact_person_phone", e.target.value)
          }
          type="number"
          required
          error={errors.contact_person_phone}
          name="contact_person_phone"
          className="w-full"
        />

        <MapWithSearch
          label={tcommon("address")}
          placeholder={tcommon("address")}
          value={customers.address || ""}
          onChange={(e) => handleInputChange("address", e.target.value)}
          onPlaceSelect={handleGooglePlaceSelect}
          error={errors.address}
          required
        />

        <SMSInput
          label={tcommon("postal_code")}
          placeholder={tcommon("postal_code")}
          value={customers.postal_code}
          onChange={(e) => handleInputChange("postal_code", e.target.value)}
          required
          type="number"
          error={errors.postal_code}
          name="postal_code"
          className="w-full"
        />

        <CountryCitySection
          data={customers}
          locationData={locationData}
          errors={errors}
          handleInputChange={(field, value) => {
            if (typeof field === "string" && field in customers) {
              handleInputChange(field as keyof typeof customers, value);
            }
          }}
        />
      </div>

      <div
        className={`flex ${isDialog ? "justify-between" : "justify-end"} mt-10 pl-2 h-[54px]`}
      >
        {isDialog && (
          <SMSButton
            className="bg-gray-300 text-black rounded-full mr-4"
            onClick={onclose}
            text={tcommon("buttons.cancel")}
            type="button"
          />
        )}
        <SMSButton
          className="bg-black rounded-full"
          type="submit"
          loading={loading}
          loadingText={
            id ? tcommon("updating_customer") : tcommon("creating_customer")
          }
          text={id ? tcommon("buttons.update") : tcommon("buttons.save")}
        />
      </div>
    </form>
  );
};

export default CustomerForm;

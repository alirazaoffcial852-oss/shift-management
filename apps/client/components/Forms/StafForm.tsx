"use client";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Staff } from "@/types/staff";
import { Label } from "@workspace/ui/components/label";
import { useStaffForm } from "@/hooks/staff/useStaffForm";
import { EditFormProps } from "@workspace/ui/types/formLayout";
import { genderOptions } from "@/constants";
import { User } from "@workspace/ui/types/user";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { CountryCitySection } from "./CountryCitySection";
import { useTranslations } from "next-intl";
import { useRoleManager } from "@/hooks/role/useRole";
import { useApp } from "@/providers/appProvider";
import { useState, useCallback } from "react";
import { RolePermissionsDialog } from "@/app/[locale]/settings/role/components/RoleDialog/roleDialog";
import { RoleFormData } from "@/types/role";
import MapWithSearch from "@/components/Map";
import http from "@workspace/ui/lib/http";
import { City } from "@workspace/ui/types/city";
import { Country } from "@workspace/ui/types/country";

const StaffForm: React.FC<EditFormProps> = ({
  useComponentAs,
  id,
  isEditMode,
}) => {
  const {
    staff,
    errors,
    setStaff,
    handleLoadMoreRoles,
    handleSearchRoles,
    handleSubmit,
    loading: isSubmitting,
  } = useStaffForm(Number(id));
  const t = useTranslations("common");
  const tcommon = useTranslations("common");
  const tcommonLabels = useTranslations("common.labels");
  const tsidebar = useTranslations("components.sidebar");
  const tactions = useTranslations("actions");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { activeCompany } = useApp();

  const roleManager = useRoleManager({
    actAs: "STAFF", // Only get employee roles
    withSearch: true,
    forDropdown: true, // Format for dropdown
    initialLimit: 20,
  });
  const {
    roles,
    setRoles,
    loading,
    handlerAddRoles,
    existingRoles,
    permissions,
    isLoadingRoles,
    handleSearch,
    handleLoadMore,
    pagination,
    roleErrors,
    fetchRoles,
  } = roleManager;

  const handleSaveRole = async () => {
    let response = await handlerAddRoles();
    if (response) {
      fetchRoles();
      setIsDialogOpen(false);
    }
  };

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
    const immediateUpdate: Staff = {
      ...staff,
      address: value,
    };
    setStaff(immediateUpdate);

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

    const updatedStaff: Staff = {
      ...staff,
      address: value,
      postal_code: postal || staff.postal_code,
    };

    if (resolvedCountry) {
      updatedStaff.country = resolvedCountry.id;

      const resolvedCity = await fetchCityByName(resolvedCountry.id, cityName);

      if (resolvedCity) {
        updatedStaff.city = resolvedCity.id;
        updatedStaff.location = {
          country: resolvedCountry,
          city: resolvedCity,
        };
      } else {
        if (staff.location?.city) {
          updatedStaff.location = {
            country: resolvedCountry,
            city: staff.location.city,
          };
        } else {
          updatedStaff.location = undefined;
        }
      }
    }

    setStaff(updatedStaff);
  };

  const handleChange = (
    field: keyof Staff | keyof User,
    value: string | any
  ) => {
    if (field === "name" || field === "email") {
      setStaff({
        ...staff,
        user: {
          ...staff.user,
          [field]: value,
        },
      });
    } else {
      setStaff({
        ...staff,
        [field]: value,
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <SMSInput
          label={`${tsidebar("staff")} ${tcommonLabels("name")}`}
          placeholder={`${tsidebar("staff")} ${tcommonLabels("name")}`}
          value={staff.user.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
          className="w-full"
        />

        <SMSCombobox
          label={` ${tsidebar("staff")}`}
          placeholder={tcommon("select_role")}
          searchPlaceholder={tcommon("search_role")}
          value={staff.role_id}
          onValueChange={(value) => handleChange("role_id", value)}
          options={existingRoles.map((role: any) => ({
            value: role.id,
            label: role.name,
          }))}
          required
          error={errors.role_id}
          addNew={{
            text: tcommon("add_role"),
            onClick: () => setIsDialogOpen(true),
          }}
          hasMore={pagination.page < pagination.total_pages}
          loadingMore={isLoadingRoles}
          onLoadMore={handleLoadMore}
          onSearch={handleSearch}
        />

        <SMSInput
          label={`${tcommonLabels("email")} `}
          type="email"
          placeholder={`${tcommonLabels("email")} `}
          value={staff.user.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
          className="w-full"
          disabled={isEditMode}
        />
        <SMSInput
          label={`${tcommonLabels("phone")} `}
          placeholder={`${tcommonLabels("phone")} `}
          type="number"
          value={staff.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          required
          className="w-full"
        />
        <SMSInput
          label={`${t("date_of_birth")} `}
          type="date"
          value={staff.date_of_birth}
          onChange={(e) => handleChange("date_of_birth", e.target.value)}
          error={errors.date_of_birth}
          required
          className="w-full"
        />
        <SMSInput
          label={`${t("hiring_date")} `}
          type="date"
          value={(() => {
            try {
              if (!staff.hiring_date) return "";
              // If it's already in YYYY-MM-DD format, return as is
              const dateStr = staff.hiring_date.toString();
              if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                return dateStr;
              }
              // Otherwise, extract date without timezone conversion
              const date = new Date(staff.hiring_date);
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            } catch {
              return "";
            }
          })()}
          onChange={(e) => handleChange("hiring_date", e.target.value)}
          error={errors.hiring_date}
          required
          className="w-full"
        />
        <div className="space-y-2">
          <Label className="font-medium text-gray-700 ml-1">
            {" "}
            {`${t("gender")} `}
          </Label>
          <Select
            value={staff.gender?.toString()}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger className="h-12 rounded-[16px] w-full">
              <SelectValue placeholder={`${t("gender")}`} />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-500">{errors.gender}</p>
          )}
        </div>
        <MapWithSearch
          label={`${t("address")} `}
          placeholder={tcommon("enter_address")}
          value={staff.address}
          onChange={(e) => handleChange("address", e.target.value)}
          onPlaceSelect={handleGooglePlaceSelect}
          error={errors.address}
          required
        />
        <CountryCitySection
          data={staff}
          locationData={staff?.location}
          errors={errors}
          handleInputChange={(field, value) => {
            if (typeof field === "string" && field in staff) {
              handleChange(field as keyof typeof staff, value);
            }
          }}
        />
        <SMSInput
          label={`${t("postal_code")} `}
          placeholder={tcommon("enter_postal_code")}
          type="number"
          value={staff.postal_code}
          onChange={(e) => handleChange("postal_code", e.target.value)}
          error={errors.postal_code}
          required
          className="w-full"
        />
      </div>
      <RolePermissionsDialog
        roles={roles as unknown as RoleFormData[]}
        setRoles={setRoles}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        permissions={permissions}
        errors={roleErrors}
        companies={activeCompany ? [activeCompany] : []}
        onSave={handleSaveRole}
        loading={loading}
      />
      <div className="flex justify-end mt-6 sm:mt-10">
        <SMSButton
          className="bg-black rounded-full"
          onClick={handleSubmit}
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Submitting..." : tactions("submit")}
        </SMSButton>
      </div>
    </div>
  );
};

export default StaffForm;

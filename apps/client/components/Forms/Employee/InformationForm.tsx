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
import { Employee } from "@/types/employee";
import { Label } from "@workspace/ui/components/label";
import { GENDER } from "@/constants/shared/globals";
import { EmployeeFormProps } from "./components/types/form";
import { User } from "@workspace/ui/types/user";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { CountryCitySection } from "../CountryCitySection";
import { useTranslations } from "next-intl";
import { RolePermissionsDialog } from "@/app/[locale]/settings/role/components/RoleDialog/roleDialog";
import { RoleFormData } from "@/types/role";
import { useState, useCallback } from "react";
import { useApp } from "@/providers/appProvider";
import { useRoleManager } from "@/hooks/role/useRole";
import MapWithSearch from "@/components/Map";
import http from "@workspace/ui/lib/http";
import { City } from "@workspace/ui/types/city";
import { Country } from "@workspace/ui/types/country";

export function EmployeeForm({
  employee,
  onUpdate,
  errors,
  onContinue,
  isEditMode = false,
  isDialog = false,
  onclose,
}: EmployeeFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    const immediateUpdate: Employee = {
      ...employee,
      address: value,
    };
    onUpdate(immediateUpdate);

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

    // Update with postal code if available
    const updatedEmployee: Employee = {
      ...employee,
      address: value,
      postal_code: postal || employee.postal_code,
    };

    if (resolvedCountry) {
      updatedEmployee.country = resolvedCountry.id;

      const resolvedCity = await fetchCityByName(resolvedCountry.id, cityName);

      if (resolvedCity) {
        updatedEmployee.city = resolvedCity.id;
        updatedEmployee.location = {
          country: resolvedCountry,
          city: resolvedCity,
        };
      } else {
        if (employee.location?.city) {
          updatedEmployee.location = {
            country: resolvedCountry,
            city: employee.location.city,
          };
        } else {
          updatedEmployee.location = undefined;
        }
      }
    }

    // Final update with all resolved data
    onUpdate(updatedEmployee);
  };

  const { activeCompany } = useApp();

  const roleManager = useRoleManager({
    actAs: "EMPLOYEE", // Only get employee roles
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

  const t = useTranslations("common");
  const tcommon = useTranslations("common.labels");
  const tactions = useTranslations("actions");

  const handleSaveRole = async () => {
    let response = await handlerAddRoles();
    if (response) {
      fetchRoles();
      setIsDialogOpen(false);
    }
  };

  const handleChange = (
    field: keyof Employee | keyof User,
    value: string | number
  ) => {
    if (field === "name" || field === "email") {
      onUpdate({
        ...employee,
        user: {
          ...employee.user,
          [field]: value,
        },
      });
    } else {
      onUpdate({
        ...employee,
        [field]: value,
      });
    }
  };
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <SMSInput
          label={tcommon("name")}
          placeholder={t("enter_employee_name")}
          value={employee.user.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
          className="w-full"
        />

        <SMSCombobox
          label={`${tcommon("role")}`}
          placeholder={t("select_role")}
          searchPlaceholder={t("search_role")}
          value={employee.role_id}
          onValueChange={(value) => handleChange("role_id", value)}
          options={existingRoles.map((role: any) => ({
            value: role.id,
            label: role.name,
          }))}
          required
          error={errors.role_id}
          addNew={{
            text: t("add_role"),
            onClick: () => setIsDialogOpen(true),
          }}
          hasMore={pagination.page < pagination.total_pages}
          loadingMore={isLoadingRoles}
          onLoadMore={handleLoadMore}
          onSearch={handleSearch}
        />

        <SMSInput
          label={tcommon("email")}
          type="email"
          placeholder={t("enter_email_address")}
          value={employee.user.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
          className="w-full"
          disabled={isEditMode}
        />
        <SMSInput
          label={tcommon("phone")}
          type="number"
          placeholder={tcommon("phone")}
          value={employee.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          error={errors.phone}
          required
          className="w-full"
        />
        <SMSInput
          label={t("date_of_birth")}
          type="date"
          value={employee.date_of_birth}
          onChange={(e) => handleChange("date_of_birth", e.target.value)}
          error={errors.date_of_birth}
          required
          className="w-full"
        />
        <SMSInput
          label={t("hiring_date")}
          type="date"
          value={employee.hiring_date}
          onChange={(e) => handleChange("hiring_date", e.target.value)}
          error={errors.hiring_date}
          required
          className="w-full"
        />
        <div className="space-y-2">
          <Label className=" font-medium text-gray-700 ml-1">
            {t("gender")}
          </Label>
          <Select
            value={employee.gender.toString()}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger className="h-12 rounded-[16px] w-full">
              <SelectValue placeholder={`${t("gender")}`} />
            </SelectTrigger>
            <SelectContent>
              {GENDER.map((gender) => (
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
          label={t("address")}
          placeholder={t("enter_address")}
          value={employee.address}
          onChange={(e) => handleChange("address", e.target.value)}
          onPlaceSelect={handleGooglePlaceSelect}
          error={errors.address}
          required
        />
        <CountryCitySection
          data={employee}
          locationData={employee?.location}
          errors={errors}
          handleInputChange={(field, value) => {
            handleChange(field as keyof Employee | keyof User, value);
          }}
        />
        <SMSInput
          label={t("postal_code")}
          type="text"
          placeholder={t("enter_postal_code")}
          value={employee.postal_code}
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
      <div className="flex justify-between mt-8">
        {isDialog && onclose && (
          <SMSButton
            variant="outline"
            className="py-[14px] px-[24px] text-[16px] h-[54px] font-semibold"
            onClick={onclose}
          >
            {tactions("cancel")}
          </SMSButton>
        )}
        <div className={isDialog ? "ml-auto" : ""}>
          <SMSButton
            className="py-[14px] px-[24px] text-[16px] h-[54px] font-semibold"
            onClick={onContinue}
          >
            {tactions("continue")}
          </SMSButton>
        </div>
      </div>
    </div>
  );
}

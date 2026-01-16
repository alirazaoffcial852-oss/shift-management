import { Customer } from "@/types/customer";
import { Employee } from "@/types/employee";
import { Staff } from "@/types/staff";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useCountry } from "@workspace/ui/hooks/useCountry";
import { City } from "@workspace/ui/types/city";
import { Country } from "@workspace/ui/types/country";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface CountryCitySectionProps {
  data: Partial<Customer> | Partial<Employee> | Partial<Staff>;
  locationData?: {
    country: Country;
    city: City;
  };
  errors: Record<string, string>;
  handleInputChange: (
    field: keyof Customer | Employee | Staff,
    value: string | number
  ) => void;
}

export const CountryCitySection: React.FC<CountryCitySectionProps> = ({
  data,
  locationData,
  errors,
  handleInputChange,
}) => {
  const [localLocationCity, setLocalLocationCity] = useState<City>();

  const {
    countries,
    cities,
    setCountries,
    setCities,
    countriesLoading,
    citiesLoading,
    citiesPagination,
    countriesPagination,
    handleLoadMoreCities,
    handleLoadMoreCountries,
    handleSearchCities,
    handleSearchCountries,
  } = useCountry(data.country as number);

  useEffect(() => {
    if (locationData?.city) {
      setLocalLocationCity(locationData.city);
    }
  }, [locationData]);

  useEffect(() => {
    if (locationData?.country) {
      setCountries((prevCountries) => {
        const exists = prevCountries.some(
          (c) => c.id.toString() === locationData.country.id.toString()
        );
        if (!exists) {
          return [...prevCountries, locationData.country];
        }
        return prevCountries;
      });
    }
  }, [locationData, setCountries]);

  useEffect(() => {
    if (localLocationCity && cities) {
      const exists = cities.some(
        (c) => c.id.toString() === localLocationCity.id.toString()
      );
      if (!exists) {
        setCities((prev) => [...prev, localLocationCity]);
      }
    }
  }, [cities, localLocationCity, setCities]);

  const tcommon = useTranslations("common");

  return (
    <>
      <SMSCombobox
        options={countries.map((country) => ({
          label: country.name,
          value: country.id.toString(),
        }))}
        label={tcommon("country")}
        value={data.country ? data.country.toString() : ""}
        loading={countriesLoading}
        error={errors["country"]}
        placeholder={tcommon("select_country")}
        searchPlaceholder="Search country..."
        required
        onValueChange={(value) => handleInputChange("country", value)}
        hasMore={countriesPagination.page < countriesPagination.total_pages}
        loadingMore={countriesLoading}
        onLoadMore={handleLoadMoreCountries}
        onSearch={handleSearchCountries}
      />

      <SMSCombobox
        options={cities.map((city) => ({
          label: city.name,
          value: city.id.toString(),
        }))}
        label={tcommon("city")}
        value={data.city ? data.city.toString() : ""}
        loading={citiesLoading}
        disabled={!data.country}
        error={errors["city"]}
        placeholder={tcommon("select_city")}
        searchPlaceholder="Search city..."
        required
        onValueChange={(value) => handleInputChange("city", value)}
        hasMore={citiesPagination.page < citiesPagination.total_pages}
        loadingMore={citiesLoading}
        onLoadMore={handleLoadMoreCities}
        onSearch={handleSearchCities}
      />
    </>
  );
};

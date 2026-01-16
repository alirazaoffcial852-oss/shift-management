import { useCountry } from "@/hooks/useCountry";
import { CountryCitySectionProps } from "@/types/clientForm.interface";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { City } from "@workspace/ui/types/city";
import { useEffect, useState } from "react";

export const CountryCitySection: React.FC<CountryCitySectionProps> = ({
  data,
  errors,
  handleInputChange,
  locationData,
}) => {
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
  } = useCountry(data.country.id as number);
  const [localLocationCity, setLocalLocationCity] = useState<City>();
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

  return (
    <>
      <SMSCombobox
        options={countries.map((country) => ({
          label: country.name,
          value: country.id.toString(),
        }))}
        label="Country"
        value={data.country.id?.toString()}
        loading={countriesLoading}
        error={errors["country_id"]}
        placeholder="Select country"
        searchPlaceholder="Search country..."
        required
        onValueChange={(value) => handleInputChange("country", "id", value)}
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
        label="City"
        value={data.city.id?.toString()}
        loading={citiesLoading}
        disabled={!data.country.id}
        error={errors["city_id"]}
        placeholder="Select city"
        searchPlaceholder="Search city..."
        required
        onValueChange={(value) => handleInputChange("city", "id", value)}
        hasMore={citiesPagination.page < citiesPagination.total_pages}
        loadingMore={citiesLoading}
        onLoadMore={handleLoadMoreCities}
        onSearch={handleSearchCities}
      />
    </>
  );
};

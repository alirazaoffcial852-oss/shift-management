import http from "@workspace/ui/lib/http";
import { useCallback, useEffect, useState } from "react";
import { Country } from "@workspace/ui/types/country";
import { City } from "@workspace/ui/types/city";

export const useCountry = (country_id: number) => {
  // Countries state
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesSearchQuery, setCountriesSearchQuery] = useState("");
  const [countriesPagination, setCountriesPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });

  // Cities state
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesSearchQuery, setCitiesSearchQuery] = useState("");
  const [citiesPagination, setCitiesPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    total_pages: 0,
  });

  const fetchCountries = useCallback(
    async (page = 1, searchTerm = "") => {
      setCountriesLoading(true);

      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      searchParams.append("limit", countriesPagination.limit.toString());

      if (searchTerm) searchParams.append("search", searchTerm);

      try {
        const response = await http.get(
          `/countries?${searchParams.toString()}`
        );

        const data = response.data.data as Country[];
        const pagination = response.data.pagination;

        if (page === 1) {
          setCountries(data);
        } else {
          setCountries((prev) => [...prev, ...data]);
        }

        if (pagination) {
          setCountriesPagination({
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            total_pages: pagination.total_pages,
          });
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setCountriesLoading(false);
      }
    },
    [countriesPagination.limit]
  );

  const fetchCities = useCallback(
    async (countryId: number, page = 1, searchTerm = "") => {
      if (!countryId) return;

      setCitiesLoading(true);

      const searchParams = new URLSearchParams();
      searchParams.append("page", page.toString());
      searchParams.append("limit", citiesPagination.limit.toString());

      if (searchTerm) searchParams.append("search", searchTerm);

      try {
        const response = await http.get(
          `/countries/${countryId}/cities?${searchParams.toString()}`
        );

        const data = response.data.data as City[];
        const pagination = response.data.pagination;

        if (page === 1) {
          setCities(data);
        } else {
          setCities((prev) => [...prev, ...data]);
        }

        if (pagination) {
          setCitiesPagination({
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            total_pages: pagination.total_pages,
          });
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setCitiesLoading(false);
      }
    },
    [citiesPagination.limit]
  );

  const handleLoadMoreCountries = useCallback(() => {
    if (countriesPagination.page < countriesPagination.total_pages) {
      fetchCountries(countriesPagination.page + 1, countriesSearchQuery);
    }
  }, [fetchCountries, countriesPagination, countriesSearchQuery]);

  const handleSearchCountries = useCallback(
    (searchTerm: string) => {
      setCountriesSearchQuery(searchTerm);
      setCountriesPagination((prev) => ({ ...prev, page: 1 }));
      fetchCountries(1, searchTerm);
    },
    [fetchCountries]
  );

  const handleLoadMoreCities = useCallback(() => {
    if (country_id && citiesPagination.page < citiesPagination.total_pages) {
      fetchCities(country_id, citiesPagination.page + 1, citiesSearchQuery);
    }
  }, [fetchCities, citiesPagination, citiesSearchQuery, country_id]);

  const handleSearchCities = useCallback(
    (searchTerm: string) => {
      if (!country_id) return;

      setCitiesSearchQuery(searchTerm);
      setCitiesPagination((prev) => ({ ...prev, page: 1 }));
      fetchCities(country_id, 1, searchTerm);
    },
    [fetchCities, country_id]
  );

  useEffect(() => {
    fetchCountries(1, "");
  }, [fetchCountries]);

  useEffect(() => {
    if (country_id) {
      setCities([]);
      setCitiesPagination((prev) => ({ ...prev, page: 1 }));
      setCitiesSearchQuery("");
      fetchCities(country_id, 1, "");
    }
  }, [country_id, fetchCities]);

  return {
    countries,
    setCountries,
    setCities,
    cities,
    countriesLoading,
    citiesLoading,
    countriesPagination,
    citiesPagination,
    handleLoadMoreCountries,
    handleSearchCountries,
    handleLoadMoreCities,
    handleSearchCities,
  };
};

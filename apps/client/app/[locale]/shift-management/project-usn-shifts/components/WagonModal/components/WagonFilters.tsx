import React, { useState, useCallback, useEffect, useMemo } from "react";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { WagonFilters } from "@/types/projectUsn";
import { useWagonFilterOptions } from "../hooks/useWagonFilterOptions";
import LocationService from "@/services/location";
import { Location } from "@/types/location";
import { useCompany } from "@/providers/appProvider";

interface WagonFiltersProps {
  filters: WagonFilters;
  onFilterChange: (field: keyof WagonFilters, value: string) => void;
  statusOptions: Array<{ value: string; label: string }>;
  wagonTypeOptions: Array<{ value: string; label: string }>;
  railOptions: Array<{ value: string; label: string }>;
  t: (key: string) => string;
}

export const WagonFiltersSection: React.FC<WagonFiltersProps> = ({
  filters,
  onFilterChange,
  statusOptions,
  wagonTypeOptions,
  railOptions,
  t,
}) => {
  const { company } = useCompany();
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [locationPage, setLocationPage] = useState(1);
  const [locationTotalPages, setLocationTotalPages] = useState(1);
  const [loadingMoreLocations, setLoadingMoreLocations] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [additionalLocations, setAdditionalLocations] = useState<Location[]>([]);
  const fetchedLocationIdsRef = React.useRef<Set<number>>(new Set());

  useEffect(() => {
    if (company?.id) {
      LocationService.getAllLocations(1, 20, company.id, "", "")
        .then((response) => {
          if (response?.data?.data) {
            setAllLocations(response.data.data);
          }
          if (response?.data?.pagination) {
            setLocationTotalPages(response.data.pagination.total_pages || 1);
          }
        })
        .catch((error) => {
          console.error("Error fetching locations:", error);
        });
    }
  }, [company?.id]);

  const loadMoreLocations = useCallback(
    async (searchQuery?: string) => {
      if (!company?.id || loadingMoreLocations || locationPage >= locationTotalPages) {
        return;
      }

      setLoadingMoreLocations(true);
      try {
        const nextPage = locationPage + 1;
        const queryToUse = searchQuery !== undefined ? searchQuery : locationSearchQuery;
        const response = await LocationService.getAllLocations(
          nextPage,
          20,
          company.id,
          queryToUse,
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
    },
    [company?.id, locationPage, locationTotalPages, loadingMoreLocations, locationSearchQuery]
  );

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
            if (response.data.pagination) {
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

  const mergedLocations = useMemo(() => {
    const merged = [...allLocations];
    additionalLocations.forEach((additionalLoc) => {
      if (!merged.some((loc) => loc.id === additionalLoc.id)) {
        merged.push(additionalLoc);
      }
    });
    return merged;
  }, [allLocations, additionalLocations]);

  useEffect(() => {
    const fetchMissingLocation = async () => {
      if (!filters.location) return;

      const locationId = parseInt(filters.location, 10);
      if (isNaN(locationId) || locationId <= 0) return;

      const existsInMain = allLocations.some(
        (loc) => loc && loc.id && loc.id.toString() === locationId.toString()
      );
      const existsInAdditional = additionalLocations.some(
        (loc) => loc && loc.id && loc.id.toString() === locationId.toString()
      );
      const alreadyFetched = fetchedLocationIdsRef.current.has(locationId);

      if (!existsInMain && !existsInAdditional && !alreadyFetched) {
        fetchedLocationIdsRef.current.add(locationId);

        try {
          const response = await LocationService.getLocationById(locationId);
          const locationData = response.data?.data || response.data || response;

          if (locationData && locationData.id) {
            setAdditionalLocations((prev) => {
              const existingIds = new Set(prev.map((l) => l?.id).filter(Boolean));
              if (!existingIds.has(locationData.id)) {
                return [...prev, locationData];
              }
              return prev;
            });
          }
        } catch (error) {
          fetchedLocationIdsRef.current.delete(locationId);
        }
      }
    };

    fetchMissingLocation();
  }, [filters.location, allLocations, additionalLocations]);

  const locationOptions = useMemo(
    () =>
      mergedLocations.map((location) => ({
        value: location.id.toString(),
        label: location.name,
      })),
    [mergedLocations]
  );

  const hasMoreLocations = locationPage < locationTotalPages;


  return (
    <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
      <SMSCombobox
        placeholder={t("filters.location")}
        value={filters.location}
        onValueChange={(value) => onFilterChange("location", value)}
        options={locationOptions}
        hasMore={hasMoreLocations}
        onLoadMore={() => loadMoreLocations()}
        loadingMore={loadingMoreLocations}
        onSearch={handleLocationSearch}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("filters.status")}
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
        options={statusOptions}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("filters.wagonType")}
        value={filters.wagonType}
        onValueChange={(value) => onFilterChange("wagonType", value)}
        options={wagonTypeOptions}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("filters.rail")}
        value={filters.rail}
        onValueChange={(value) => onFilterChange("rail", value)}
        options={railOptions}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("tableHeaders.nextStatus")}
        value={filters.nextStatus}
        onValueChange={(value) => onFilterChange("nextStatus", value)}
        options={statusOptions}
        className="w-full"
      />
      <SMSInput
        type="date"
        value={filters.date}
        onChange={(e) => onFilterChange("date", e.target.value)}
        placeholder={t("filters.date")}
        className="w-full"
      />
    </div>
  );
};

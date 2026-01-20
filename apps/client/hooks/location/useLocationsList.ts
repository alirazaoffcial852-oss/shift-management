import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useCompany } from "@/providers/appProvider";
import LocationService from "@/services/location";
import { Location } from "@/types/location";

export const useLocationsList = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");

  const fetchLocations = useCallback(
    async (page: number = 1, search: string = "", type: string = "") => {
      if (!company?.id) return;

      setLoading(true);
      try {
        const response = await LocationService.getAllLocations(
          page,
          limit,
          company.id,
          search,
          type
        );

        setLocations(response.data.data || []);

        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            total_pages: response.data.pagination.total_pages,
          });
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    },
    [company?.id, limit]
  );

  useEffect(() => {
    if (company?.id) {
      fetchLocations(pagination.page, searchTerm, filterType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company?.id, pagination.page, searchTerm, filterType]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleFilter = useCallback((type: string) => {
    setFilterType(type);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await LocationService.deleteLocation(id);
        toast.success("Location deleted successfully");
        fetchLocations(pagination.page, searchTerm, filterType);
      } catch (error) {
        console.error("Error deleting location:", error);
        toast.error("Failed to delete location");
      }
    },
    [fetchLocations, pagination.page, searchTerm, filterType]
  );

  const formattedLocations = useMemo(
    () =>
      locations.map((location: any, index: number) => ({
        id: (pagination.page - 1) * pagination.limit + index + 1,
        locationName: location.name,
        ...location,
      })),
    [locations, pagination.page, pagination.limit]
  );

  return {
    locations: formattedLocations,
    rawLocations: locations,
    loading,
    pagination,
    searchTerm,
    filterType,
    handleSearch,
    handleFilter,
    handleDelete,
    fetchLocations,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    onPageChange: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
  };
};

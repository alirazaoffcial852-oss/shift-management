import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useCompany } from "@/providers/appProvider";
import LocationService from "@/services/location";
import { Location } from "@/types/location";

export const useLocationsList = () => {
  const { company } = useCompany();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
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
          pagination.per_page,
          company.id,
          search,
          type
        );

        setLocations(response.data.data);
        setPagination(response.pagination || pagination);
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    },
    [company?.id, pagination.per_page]
  );

  useEffect(() => {
    if (company?.id) {
      fetchLocations(1, searchTerm, filterType);
    }
  }, [company?.id, fetchLocations]);

  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      fetchLocations(1, search, filterType);
    },
    [fetchLocations, filterType]
  );

  const handleFilter = useCallback(
    (type: string) => {
      setFilterType(type);
      fetchLocations(1, searchTerm, type);
    },
    [fetchLocations, searchTerm]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      fetchLocations(page, searchTerm, filterType);
    },
    [fetchLocations, searchTerm, filterType]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await LocationService.deleteLocation(id);
        toast.success("Location deleted successfully");
        fetchLocations(pagination.current_page, searchTerm, filterType);
      } catch (error) {
        console.error("Error deleting location:", error);
        toast.error("Failed to delete location");
      }
    },
    [fetchLocations, pagination.current_page, searchTerm, filterType]
  );

  return {
    locations,
    loading,
    pagination,
    searchTerm,
    filterType,
    handleSearch,
    handleFilter,
    handlePageChange,
    handleDelete,
    fetchLocations,
  };
};

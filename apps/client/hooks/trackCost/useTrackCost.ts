import { useState, useEffect, useCallback } from "react";
import { TrackCostShift, TrackCostStatus } from "@/types/trackCost";
import TrackCostService from "@/services/trackCost";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useTrackCostTable = () => {
  const [trackCostShifts, setTrackCostShifts] = useState<TrackCostShift[]>([]);
  const [trackCost, setTrackCost] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTrackCostShifts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await TrackCostService.getTrackCostShifts({
        page: currentPage,
        limit: 20,
        search: searchQuery,
      });

      if (response?.data?.data) {
        setTrackCostShifts(response.data.data);
        setTotalPages(response.data.pagination.total_pages);
      }
    } catch (error: any) {
      console.error("Error fetching track cost shifts:", error);
      toast.error(error?.data?.message || "Failed to fetch track cost shifts");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchTrackCostShifts();
  }, [fetchTrackCostShifts]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const updateShiftStatus = useCallback(
    async (id: number, status: TrackCostStatus) => {
      try {
        const response = await TrackCostService.updateTrackCostStatus(
          id.toString(),
          status
        );

        setTrackCostShifts((prev) =>
          prev.map((shift) => (shift.id === id ? { ...shift, status } : shift))
        );

        toast.success(response?.message || "Status updated successfully");
      } catch (error: any) {
        console.error("Error updating shift status:", error);
        toast.error(error?.data?.message || "Failed to update status");
      }
    },
    []
  );

  const validateForm = () => {
    if (!trackCost.trim()) {
      setError("Track cost is required");
      return false;
    }
    const numericValue = parseFloat(trackCost.replace(/,/g, ""));
    if (isNaN(numericValue) || numericValue <= 0) {
      setError("Please enter a valid track cost amount");
      return false;
    }
    setError("");
    return true;
  };

  const handleTrackCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9,]/g, "");
    setTrackCost(numericValue);
    if (error) setError("");
  };

  return {
    trackCostShifts,
    currentPage,
    totalPages,
    isLoading,
    setCurrentPage,
    handleSearch,
    updateShiftStatus,
    refetch: fetchTrackCostShifts,
    validateForm,
    handleTrackCostChange,
    trackCost,
    error,
    loading,
    setLoading,
  };
};

export const useTrackCostEdit = (TrackCostId: string) => {
  const router = useRouter();
  const [trackCost, setTrackCost] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCost, setTotalCost] = useState<number>();

  const fetchTrackCostData = useCallback(async () => {
    if (!TrackCostId) return;

    setIsLoading(true);
    try {
      const response =
        await TrackCostService.getTrackCostByShiftId(TrackCostId);
      console.log(response, "response");
      if (response?.data) {
        const formattedCost = response.data.track_cost
          ? parseFloat(response.data.track_cost).toLocaleString()
          : "";
        setTrackCost(formattedCost);
        setShiftId(response.data.shift_id?.toString() || "");
        setTotalCost(response.data.total_cost);
      }
    } catch (error: any) {
      console.error("Error fetching track cost data:", error);
      toast.error(error?.data?.message || "Failed to fetch track cost data");
    } finally {
      setIsLoading(false);
    }
  }, [TrackCostId]);

  useEffect(() => {
    fetchTrackCostData();
  }, [fetchTrackCostData]);

  const validateForm = () => {
    if (!trackCost.trim()) {
      setError("Track cost is required");
      return false;
    }
    const numericValue = parseFloat(trackCost.replace(/,/g, ""));
    if (isNaN(numericValue) || numericValue <= 0) {
      setError("Please enter a valid track cost amount");
      return false;
    }
    setError("");
    return true;
  };

  const handleTrackCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9,]/g, "");
    setTrackCost(numericValue);
    if (error) setError("");
  };

  const updateTrackCost = async () => {
    if (!validateForm()) return false;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("shift_id", shiftId);
      formData.append("track_cost", trackCost.replace(/,/g, ""));
      const response = await TrackCostService.updateTrackCost(
        TrackCostId,
        formData
      );
      toast.success(response?.message || "Track cost updated successfully");
      router.push("/track-cost");
      return true;
    } catch (error: any) {
      console.error("Error updating track cost:", error);
      toast.error(error?.data?.message || "Failed to update track cost");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    trackCost,
    error,
    loading,
    isLoading,
    handleTrackCostChange,
    updateTrackCost,
    validateForm,
    totalCost,
  };
};

import { useState, useEffect, useCallback, useRef } from "react";
import WagonService from "@/services/wagon.service";
import { WagonOption } from "@/types/projectUsn";
import { buildApiFilters, transformWagonFilterToOption } from "../utils/wagonModal.utils";
import { WagonFilters } from "@/types/projectUsn";
import { WAGON_PAGINATION } from "../constants/wagonModal.constants";

interface UseWagonPaginationProps {
  initialWagons: WagonOption[];
  filters: WagonFilters;
  isOpen: boolean;
}

export const useWagonPagination = ({
  initialWagons,
  filters,
  isOpen,
}: UseWagonPaginationProps) => {
  const [allWagons, setAllWagons] = useState<WagonOption[]>(initialWagons);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filterKey = [
    filters.status,
    filters.wagonType,
    filters.rail,
    filters.location,
    filters.date,
    filters.nextStatus,
  ].join("|");

  useEffect(() => {
    if (!isOpen) return;

    setAllWagons(initialWagons);
    setCurrentPage(1);
    setTotalPages(1);
    setHasMore(initialWagons.length >= WAGON_PAGINATION.ITEMS_PER_PAGE);
  }, [isOpen, filterKey, initialWagons]);

  const loadMoreWagons = useCallback(async () => {
    if (loadingMore || currentPage >= totalPages || !hasMore) {
      return;
    }

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const apiFilters = buildApiFilters(filters);

      const response = await WagonService.getWagonFilters(
        nextPage,
        WAGON_PAGINATION.ITEMS_PER_PAGE,
        apiFilters
      );

      if (response?.data?.data) {
        const newWagons: WagonOption[] = response.data.data.map(transformWagonFilterToOption);

        setAllWagons((prev) => [...prev, ...newWagons]);
        setCurrentPage(nextPage);

        if (response.data.pagination) {
          setTotalPages(response.data.pagination.total_pages || 1);
          setHasMore(nextPage < (response.data.pagination.total_pages || 1));
        }
      }
    } catch (error) {
      console.error("Error loading more wagons:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, currentPage, totalPages, hasMore, filters]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasMore || loadingMore || !isOpen) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (
        scrollHeight - scrollTop - clientHeight <
        WAGON_PAGINATION.SCROLL_THRESHOLD
      ) {
        loadMoreWagons();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, isOpen, loadMoreWagons]);

  return {
    allWagons,
    loadingMore,
    scrollContainerRef,
  };
};

"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import LocomotiveService from "@/services/locomotive";
import LocomotiveActionService from "@/services/locomotiveAction";
import { useCompany } from "@/providers/appProvider";
import { Locomotive } from "@/types/locomotive";
import { STATUS } from "@/types/shared/global";
import { OverviewOfLocomotive } from "@/types/locomotiveAction";

interface CacheEntry {
  data: Locomotive[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  timestamp: number;
}

const locomotiveCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30000;
const pendingRequests = new Map<string, Promise<any>>();

const getCacheKey = (
  companyId: number,
  page: number,
  limit: number,
  status: STATUS,
  searchTerm: string
): string => {
  return `${companyId}-${page}-${limit}-${status}-${searchTerm}`;
};

const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CACHE_DURATION;
};

export const useLocomotiveTable = (initialPage = 1, limit = 20) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [locomotives, setLocomotives] = useState<Locomotive[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const { company } = useCompany();

  const fetchLocomotive = useCallback(
    async (page = 1, searchTermParam = "") => {
      if (!company) return;

      const cacheKey = getCacheKey(
        company.id as number,
        page,
        pagination.limit,
        tabValue,
        searchTermParam
      );

      const cached = locomotiveCache.get(cacheKey);
      if (cached && isCacheValid(cached)) {
        setLocomotives(cached.data);
        setPagination(cached.pagination);
        setIsLoading(false);
        return { data: { data: cached.data, pagination: cached.pagination } };
      }

      const pendingRequest = pendingRequests.get(cacheKey);
      if (pendingRequest) {
        try {
          const response = await pendingRequest;
          const data = response.data;
          setLocomotives(data?.data || []);
          if (data?.pagination) {
            setPagination({
              page: data.pagination.page,
              limit: data.pagination.limit,
              total: data.pagination.total,
              total_pages: data.pagination.total_pages,
            });
          }
          return response;
        } catch (err) {
          return null;
        } finally {
          setIsLoading(false);
        }
      }

      setIsLoading(true);
      setError(null);

      const requestPromise = LocomotiveService.getAllLocomotives(
        page,
        pagination.limit,
        company.id as number,
        tabValue,
        searchTermParam
      )
        .then((response) => {
          const data = response.data;

          locomotiveCache.set(cacheKey, {
            data: data?.data || [],
            pagination: data?.pagination || {
              page,
              limit: pagination.limit,
              total: 0,
              total_pages: 0,
            },
            timestamp: Date.now(),
          });

          setLocomotives(data?.data || []);

          if (data?.pagination) {
            setPagination({
              page: data.pagination.page,
              limit: data.pagination.limit,
              total: data.pagination.total,
              total_pages: data.pagination.total_pages,
            });
          }

          return response;
        })
        .catch((err: any) => {
          const errorMsg = err?.message || "Failed to fetch locomotives";
          setError(errorMsg);
          console.error("Error fetching locomotives:", err);
          return null;
        })
        .finally(() => {
          pendingRequests.delete(cacheKey);
          setIsLoading(false);
        });

      pendingRequests.set(cacheKey, requestPromise);

      return requestPromise;
    },
    [company, pagination.limit, tabValue]
  );

  useEffect(() => {
    fetchLocomotive(pagination.page, searchTerm);
  }, [pagination.page, searchTerm, fetchLocomotive]);

  const clearCache = useCallback((companyId?: number) => {
    if (companyId) {
      const keysToDelete: string[] = [];
      locomotiveCache.forEach((_, key) => {
        if (key.startsWith(`${companyId}-`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => locomotiveCache.delete(key));
    } else {
      locomotiveCache.clear();
    }
    pendingRequests.clear();
  }, []);

  const archiveLocomotive = useCallback(
    (locomotiveId: number) => {
      setLocomotives((prev) => prev.filter((loco) => loco.id !== locomotiveId));
      if (company) {
        clearCache(company.id as number);
      }
    },
    [company, clearCache]
  );

  const updateLocomotiveStatus = useCallback(
    (id: number, status: STATUS) => {
      setLocomotives((prev) => prev.filter((loco) => loco.id !== id));
      if (company) {
        clearCache(company.id as number);
      }
    },
    [company, clearCache]
  );

  const deleteLocomotive = useCallback(
    (locomotiveId: number) => {
      setLocomotives((prev) => prev.filter((loco) => loco.id !== locomotiveId));
      if (company) {
        clearCache(company.id as number);
      }
    },
    [company, clearCache]
  );

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleTabChange = useCallback((val: STATUS) => {
    setTabValue(val);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const formattedLocomotives = locomotives.map((loco: any, index: number) => ({
    id: (pagination.page - 1) * pagination.limit + index + 1,
    locomotiveName: loco.name,
    ...loco,
  }));

  return {
    handleSearch,
    setLocomotives,
    locomotives: formattedLocomotives,
    rawLocomotives: locomotives,
    isLoading,
    error,
    totalCount: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    archiveLocomotive,
    deleteLocomotive,
    refetch: () => {
      if (company) {
        clearCache(company.id as number);
      }
      return fetchLocomotive(pagination.page, searchTerm);
    },
    tabValue,
    setTabValue: handleTabChange,
    updateLocomotiveStatus,
    fetchLocomotive,
    pagination,
    clearCache,
  };
};

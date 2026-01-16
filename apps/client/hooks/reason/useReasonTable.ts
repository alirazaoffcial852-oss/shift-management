import { FetchReasonResponse, Reason } from "@/types/reason";
import { useCallback, useEffect, useState } from "react";
import ReasonService from "@/services/reason";
import { toast } from "sonner";

type TranslationFunction = (key: string) => string;

export const useReasonTable = (t?: TranslationFunction) => {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "none" | "search" | "date" | "status"
  >("none");
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    type: "add" as "add" | "edit",
    id: undefined as string | undefined,
  });

  const handleOpenAddDialog = (config: {
    type: "add" | "edit";
    id?: string;
  }) => {
    setDialogConfig({
      isOpen: true,
      type: config.type,
      id: config.id,
    });
  };

  const handleCloseDialog = () => {
    setDialogConfig((prev) => ({
      ...prev,
      isOpen: false,
      id: undefined,
    }));
  };

  const limit = 10;

  const fetchReasons = useCallback(
    async (
      page: number = 1,
      filters?: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
      }
    ): Promise<FetchReasonResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page,
          limit,
          search: filters?.search || searchTerm || undefined,
          status: filters?.status || statusFilter || undefined,
          startDate: filters?.startDate || startDate || undefined,
          endDate: filters?.endDate || endDate || undefined,
        };

        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) => value !== undefined && value !== ""
          )
        );

        const response = await ReasonService.getAllReasons(cleanParams);
        setReasons(response.data.data || []);
        setTotalCount(response.data.pagination.total || 0);
        setTotalPages(response.data.pagination.totalPages || 0);
        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch reasons";
        setError(errorMsg);
        console.error("Error fetching reasons:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, statusFilter, startDate, endDate]
  );

  const handleDeleteReason = useCallback(
    async (id: string): Promise<boolean> => {
      if (!id) {
        console.error("No ID provided for deletion");
        return false;
      }

      setIsDeleting(true);
      setError(null);

      try {
        await ReasonService.deleteReason(id);

        await fetchReasons(currentPage);

        const remainingItems = reasons.length - 1;
        if (remainingItems === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        return true;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to delete reason";
        setError(errorMsg);
        console.error("Error deleting reason:", err);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [currentPage, reasons.length, fetchReasons]
  );

  useEffect(() => {
    fetchReasons(currentPage);
  }, [currentPage, fetchReasons]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getColumns = (translationFn: TranslationFunction) => [
    {
      header: translationFn("sr"),
      accessor: "id",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: "",
      accessor: "",
      className: "",
    },
    {
      header: "",
      accessor: "",
      className: "",
    },
    {
      header: "",
      accessor: "",
      className: "",
    },
    {
      header: "",
      accessor: "",
      className: "",
    },
    {
      header: translationFn("reason"),
      accessor: "reason",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
  ];

  const columns = t ? getColumns(t) : getColumns((key: string) => key);

  const handleSearch = useCallback(
    async (searchValue: string) => {
      setSearchTerm(searchValue);
      setCurrentPage(1);

      if (!searchValue.trim()) {
        setActiveFilter("none");
        await fetchReasons(1, { search: "" });
        return;
      }

      setActiveFilter("search");
      await fetchReasons(1, { search: searchValue });
    },
    [fetchReasons]
  );

  const handleDateFilter = useCallback(
    async (startDateValue: string, endDateValue: string) => {
      setStartDate(startDateValue);
      setEndDate(endDateValue);
      setCurrentPage(1);

      if (!startDateValue || !endDateValue) {
        setActiveFilter("none");
        await fetchReasons(1, { startDate: "", endDate: "" });
        return;
      }

      setActiveFilter("date");
      await fetchReasons(1, {
        startDate: startDateValue,
        endDate: endDateValue,
      });
    },
    [fetchReasons]
  );

  const handleStatusFilter = useCallback(
    async (statusValue: string) => {
      setStatusFilter(statusValue);
      setCurrentPage(1);

      if (!statusValue) {
        setActiveFilter("none");
        await fetchReasons(1, { status: "" });
        return;
      }

      setActiveFilter("status");
      await fetchReasons(1, { status: statusValue });
    },
    [fetchReasons]
  );

  const clearFilters = useCallback(async () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setActiveFilter("none");
    setCurrentPage(1);
    await fetchReasons(1, {
      search: "",
      startDate: "",
      endDate: "",
      status: "",
    });
  }, [fetchReasons]);

  const isAnyLoading = isLoading || isDeleting;

  const handleDelete = async (row: any) => {
    if (row?.id) {
      const success = await handleDeleteReason(row.id);
      if (success) {
        toast.success("Reason deleted successfully");
      }
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      clearFilters();
    } else {
      handleSearch(value);
    }
  };

  const handleDateRangeChange = (dateRange: string) => {
    if (!dateRange || dateRange === "") {
      clearFilters();
      return;
    }
    const [startDate, endDate] = dateRange.split("|");
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      handleDateFilter(formattedStartDate, formattedEndDate);
    }
  };

  const showPagination = activeFilter === "none";

  return {
    dialogConfig,
    setDialogConfig,
    handleOpenAddDialog,
    handleCloseDialog,
    handleDeleteReason,
    setIsLoading,
    currentPage,
    reasons,
    isLoading: isAnyLoading,
    isDeleting,
    totalCount,
    totalPages,
    error,
    refetch: fetchReasons,
    handlePageChange,
    columns,
    handleSearch,
    setSearchTerm,
    searchTerm,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    handleDateFilter,
    handleStatusFilter,
    clearFilters,
    activeFilter,
    handleDelete,
    handleSearchChange,
    handleDateRangeChange,
    showPagination,
  };
};

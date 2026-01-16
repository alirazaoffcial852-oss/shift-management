import { FetchTopicResponse, Topic } from "@/types/topic";
import { useCallback, useEffect, useState } from "react";
import TopicService from "@/services/topic";
import { toast } from "sonner";

type TranslationFunction = (key: string) => string;

export const useTopicTable = (t?: TranslationFunction) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
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

  const fetchTopics = useCallback(
    async (
      page: number = 1,
      filters?: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
      }
    ): Promise<FetchTopicResponse | null> => {
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

        const response = await TopicService.getAllTopics(cleanParams);

        // Handle different response structures
        const topicsData = response.data?.data || response.data || [];
        const paginationData =
          response.data?.pagination || response.pagination || {};

        // Transform data to ensure consistent field names
        const transformedTopics = topicsData.map((topic: any) => ({
          ...topic,
          topic: topic.topic || topic.topicName, // Use topic field, fallback to topicName
        }));

        // Only add local topics to page 1
        const combinedTopics =
          page === 1
            ? [
                ...localTopics.filter(
                  (local) =>
                    !transformedTopics.some(
                      (api: any) => api.topic === local.topic
                    )
                ),
                ...transformedTopics,
              ]
            : transformedTopics;

        // Add sequential row numbers for display (accounting for pagination)
        const startIndex = (page - 1) * limit;
        const topicsWithRowNumbers = combinedTopics.map(
          (topic: any, index: number) => ({
            ...topic,
            rowNumber: startIndex + index + 1,
          })
        );

        setTopics(topicsWithRowNumbers);
        setTotalCount((paginationData.total || 0) + localTopics.length);
        setTotalPages(
          Math.ceil(((paginationData.total || 0) + localTopics.length) / limit)
        );
        return response;
      } catch (err: any) {
        // Handle API not ready - show local topics instead of empty table
        console.warn("Topics API not ready:", err);

        // Only show local topics on page 1 when API fails
        if (page === 1) {
          // Add sequential row numbers to local topics
          const localTopicsWithRowNumbers = localTopics.map((topic, index) => ({
            ...topic,
            rowNumber: index + 1,
          }));

          setTopics(localTopicsWithRowNumbers);
          setTotalCount(localTopics.length);
          setTotalPages(Math.ceil(localTopics.length / limit));
          setError(null); // Don't show error, show local topics
        } else {
          // For other pages when API fails, show empty
          setTopics([]);
          setTotalCount(0);
          setTotalPages(0);
          setError(null);
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, statusFilter, startDate, endDate, localTopics]
  );

  // Function to add a topic to local state
  const addLocalTopic = useCallback((topic: Topic) => {
    const newTopic = {
      ...topic,
      id: Date.now(), // Generate temporary ID
    };
    setLocalTopics((prev) => [...prev, newTopic]);
  }, []);

  // Function to remove a topic from local state
  const removeLocalTopic = useCallback((id: number) => {
    setLocalTopics((prev) => prev.filter((topic) => topic.id !== id));
  }, []);

  const handleDeleteTopic = useCallback(
    async (id: string): Promise<boolean> => {
      if (!id) {
        console.error("No ID provided for deletion");
        return false;
      }

      setIsDeleting(true);
      setError(null);

      try {
        // Check if it's a local topic (has temporary ID from Date.now())
        const isLocalTopic = localTopics.some(
          (topic) => topic.id === Number(id)
        );

        if (isLocalTopic) {
          // Remove from local topics
          removeLocalTopic(Number(id));
        } else {
          // Delete from API
          await TopicService.deleteTopic(id);
        }

        // Refresh the table
        await fetchTopics(currentPage);

        const remainingItems = topics.length - 1;
        if (remainingItems === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }

        return true;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to delete topic";
        setError(errorMsg);
        console.error("Error deleting topic:", err);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [currentPage, topics.length, fetchTopics, localTopics, removeLocalTopic]
  );

  useEffect(() => {
    fetchTopics(currentPage);
  }, [currentPage, fetchTopics]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getColumns = (translationFn: TranslationFunction) => [
    {
      header: translationFn("sr"),
      accessor: "rowNumber",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: "",
      accessor: "",
      className: "",
    },
    {
      header: translationFn("topicName"),
      accessor: "topic",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: "",
      accessor: "",
      className: "",
    },
    {
      header: translationFn("category"),
      accessor: "category",
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
        await fetchTopics(1, { search: "" });
        return;
      }

      setActiveFilter("search");
      await fetchTopics(1, { search: searchValue });
    },
    [fetchTopics]
  );

  const handleDateFilter = useCallback(
    async (startDateValue: string, endDateValue: string) => {
      setStartDate(startDateValue);
      setEndDate(endDateValue);
      setCurrentPage(1);

      if (!startDateValue || !endDateValue) {
        setActiveFilter("none");
        await fetchTopics(1, { startDate: "", endDate: "" });
        return;
      }

      setActiveFilter("date");
      await fetchTopics(1, {
        startDate: startDateValue,
        endDate: endDateValue,
      });
    },
    [fetchTopics]
  );

  const handleStatusFilter = useCallback(
    async (statusValue: string) => {
      setStatusFilter(statusValue);
      setCurrentPage(1);

      if (!statusValue) {
        setActiveFilter("none");
        await fetchTopics(1, { status: "" });
        return;
      }

      setActiveFilter("status");
      await fetchTopics(1, { status: statusValue });
    },
    [fetchTopics]
  );

  const clearFilters = useCallback(async () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setActiveFilter("none");
    setCurrentPage(1);
    await fetchTopics(1, {
      search: "",
      startDate: "",
      endDate: "",
      status: "",
    });
  }, [fetchTopics]);

  const isAnyLoading = isLoading || isDeleting;

  const handleDelete = async (row: any) => {
    if (row?.id) {
      const success = await handleDeleteTopic(row.id);
      if (success) {
        toast.success("Topic deleted successfully");
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

  const showPagination = activeFilter === "none" || localTopics.length > 0;

  return {
    dialogConfig,
    setDialogConfig,
    handleOpenAddDialog,
    handleCloseDialog,
    handleDeleteTopic,
    setIsLoading,
    currentPage,
    topics,
    isLoading: isAnyLoading,
    isDeleting,
    totalCount,
    totalPages,
    error,
    refetch: fetchTopics,
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
    addLocalTopic,
    removeLocalTopic,
  };
};

import { useCallback, useEffect, useMemo, useState } from "react";
import LocomotiveActionService from "@/services/locomotiveAction";
import {
  FetchLocomotiveResponse,
  LocomotiveActions,
} from "@/types/locomotiveAction";
import { SampleExamine } from "@/types/Sampling";
import { toast } from "sonner";

export const useLocomotiveActionTable = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locomotiveActions, setLocomotiveActions] = useState<
    LocomotiveActions[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [actionsForSelectedLocomotive, setActionsForSelectedLocomotive] =
    useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locomotiveActionData, setLocomotiveActionData] =
    useState<LocomotiveActions | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<
    "none" | "search" | "date" | "status"
  >("none");

  const [examineDialogConfig, setExamineDialogConfig] = useState({
    isOpen: false,
    type: "add" as "add" | "edit",
    id: undefined as string | undefined,
  });

  const [examineEditDialogConfig, setExamineEditDialogConfig] = useState({
    isOpen: false,
    type: "add" as "add" | "edit",
    id: undefined as string | undefined,
  });

  const [EditDocumentEditDialogConfig, setEditDocumentEditDialogConfig] =
    useState({
      isOpen: false,
      type: "add" as "add" | "edit",
      id: undefined as string | undefined,
    });

  const fetchActionsAgainstLocomotive = useCallback(
    async (locomotiveId: number) => {
      try {
        const response =
          await LocomotiveActionService.getActionsAgainstLocomotive(
            locomotiveId
          );
        setActionsForSelectedLocomotive(response?.data || []);
        return response;
      } catch (err) {
        console.error("Failed to fetch actions", err);
        return null;
      }
    },
    []
  );

  const [viewDetailsDialogConfig, setViewDetailsDialogConfig] = useState({
    isOpen: false,
    type: "add" as "add" | "edit",
    id: undefined as string | undefined,
  });

  const handleOpenExamineDialog = ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => {
    setExamineDialogConfig({
      isOpen: true,
      type,
      id,
    });
  };

  const handleCloseExamineDialog = (sample?: SampleExamine) => {
    setExamineDialogConfig({
      isOpen: false,
      type: "add",
      id: undefined,
    });
  };

  const handleOpenExamineEditDialog = ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => {
    setExamineEditDialogConfig({
      isOpen: true,
      type,
      id,
    });
  };

  const handleOpenEditDocumentEditDialog = ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => {
    setEditDocumentEditDialogConfig({
      isOpen: true,
      type: "edit",
      id,
    });
  };

  const handleCloseEditDocumentDialog = (sample?: SampleExamine) => {
    setEditDocumentEditDialogConfig({
      isOpen: false,
      type: "edit",
      id: undefined,
    });
  };

  const handleCloseExamineEditDialog = (sample?: SampleExamine) => {
    setExamineEditDialogConfig({
      isOpen: false,
      type: "add",
      id: undefined,
    });
  };

  const handleOpenViewDetailsDialog = async ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => {
    await fetchActionsAgainstLocomotive(Number(id));
    setViewDetailsDialogConfig({
      isOpen: true,
      type,
      id,
    });
  };

  const handleCloseViewDetailsDialog = (sample?: SampleExamine) => {
    setViewDetailsDialogConfig({
      isOpen: false,
      type: "add",
      id: undefined,
    });
  };

  const limit = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const showPagination = activeFilter === "none";

  const fetchLocomotiveActions = useCallback(
    async (
      page: number = 1,
      filters?: {
        search?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
      }
    ): Promise<FetchLocomotiveResponse | null> => {
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

        const response =
          await LocomotiveActionService.getAllLocomotiveActions(cleanParams);
        setLocomotiveActions(response.data.data || []);
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

  useEffect(() => {
    fetchLocomotiveActions(currentPage);
  }, [currentPage, fetchLocomotiveActions]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchLocomotiveActions(1);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const mappedData = locomotiveActions.map((item) => ({
    id: item.id,
    nameOfLok: item.locomotive?.name,
    nameOfAction: item.action_name,
    state: item.current_state,
    documents: item.completions?.map(() => "doc") || [],
    completionDate: "",
    notes: "",
    reason: item.reason?.reason,
  }));

  const handleSearch = useCallback(
    async (searchValue: string) => {
      setSearchTerm(searchValue);
      setCurrentPage(1);

      if (!searchValue.trim()) {
        setActiveFilter("none");
        await fetchLocomotiveActions(1, { search: "" });
        return;
      }

      setActiveFilter("search");
      await fetchLocomotiveActions(1, { search: searchValue });
    },
    [fetchLocomotiveActions]
  );

  const clearFilters = useCallback(async () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setActiveFilter("none");
    setCurrentPage(1);
    await fetchLocomotiveActions(1, {
      search: "",
      startDate: "",
      endDate: "",
      status: "",
    });
  }, [fetchLocomotiveActions]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      clearFilters();
    } else {
      handleSearch(value);
    }
  };

  const data =
    locomotiveActions?.map((action) => ({
      id: action.id,
      nameOfLok: action.locomotive?.name || "Unknown",
      nameOfAction: action.action_name,
      state: (() => {
        switch (action.current_state) {
          case "OFFER_OBTAINED":
            return "Offer Obtained";
          case "ACTIVE":
            return "In Process";
          case "COMPLETED":
            return "Completed";
          default:
            return action.current_state.replace(/_/g, " ").toLowerCase();
        }
      })(),
      documents:
        action.completions?.map((c) => c.documentUrl).filter(Boolean) || [],
      completionDate: "",
      notes: "Break",
      reason: action.reason?.reason || "",
    })) || [];

  const getRowClassName = (row: any) => {
    const latestCompletionDate = row.completionDate
      ? new Date(row.completionDate)
      : null;

    if (!latestCompletionDate) {
      return "bg-green-100";
    }

    const today = new Date();
    const daysSinceCompletion = Math.floor(
      (today.getTime() - latestCompletionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const cycleDays = row.cycle_indicator_days || 30;
    const yellowThreshold = row.yellow_threshold_days || 20;
    const redThreshold = row.red_threshold_days || 10;

    const daysRemaining = cycleDays - daysSinceCompletion;

    if (daysRemaining <= redThreshold) {
      return "bg-red-100";
    } else if (daysRemaining <= yellowThreshold) {
      return "bg-yellow-100";
    }

    return "bg-green-100";
  };

  const finalData = useMemo(() => {
    return locomotiveActions?.map((item: any) => {
      const latestCompletion =
        item.completions?.length > 0
          ? [...item.completions].sort(
              (a, b) =>
                new Date(b.completion_date).getTime() -
                new Date(a.completion_date).getTime()
            )[0]
          : null;

      return {
        id: item.id,
        completionId: latestCompletion?.id || null,
        image: item.locomotive?.image || null,
        nameOfLok: item.locomotive?.name || "-",
        nameOfAction: item.action_name || "-",
        state: item.current_state || "-",
        documents:
          latestCompletion?.documents?.map((doc: any) => doc.url) || [],
        completionDate: latestCompletion?.completion_date?.split("T")[0] || "-",
        notes: latestCompletion?.note || "-",
        reason: item.reason?.reason || "-",
      };
    });
  }, [locomotiveActions]);

  const handleCompleteLocomotiveAction = async (completionId: number) => {
    try {
      if (!completionId) {
        toast.error("No completion record found for this action");
        return;
      }
      await LocomotiveActionService.completeLocomotiveAction(completionId);
      await fetchLocomotiveActions(currentPage);
      toast.success("Action Completed Successfully");
    } catch (error) {
      toast.error("Failed to complete action.");
      console.error(error);
    }
  };

  const handleDeleteLocomotiveAction = async (id: number) => {
    try {
      await LocomotiveActionService.deleteLocomotiveAction(id);
      await fetchLocomotiveActions(currentPage);
      toast.success("Action Deleted Successfully");
    } catch (error) {
      toast.error("Failed to complete action.");
      console.error(error);
    }
  };

  const handleCloseExamineDialogWithRefresh = async (sample?: any) => {
    handleCloseExamineDialog(sample);
    handleCloseEditDocumentDialog(sample);
    await fetchLocomotiveActions(currentPage);
  };

  const handleDateFilter = useCallback(
    async (startDateValue: string, endDateValue: string) => {
      setStartDate(startDateValue);
      setEndDate(endDateValue);
      setCurrentPage(1);

      if (!startDateValue || !endDateValue) {
        setActiveFilter("none");
        await fetchLocomotiveActions(1, { startDate: "", endDate: "" });
        return;
      }

      setActiveFilter("date");
      await fetchLocomotiveActions(1, {
        startDate: startDateValue,
        endDate: endDateValue,
      });
    },
    [fetchLocomotiveActions]
  );

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

  const activeDialogConfig = EditDocumentEditDialogConfig.isOpen
    ? EditDocumentEditDialogConfig
    : examineDialogConfig;

  const fetchLocomotiveActionData = async (actionId: number) => {
    setIsLoading(true);
    try {
      const response =
        await LocomotiveActionService.getLocomotiveActionId(actionId);
      if (response?.data) {
        setLocomotiveActionData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch locomotive action data");
      console.error("Error fetching locomotive action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    locomotiveActions,
    setIsLoading,
    isLoading,
    totalCount,
    totalPages,
    error,
    refetch: fetchLocomotiveActions,
    setSearchTerm,
    searchTerm,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    handlePageChange,
    mappedData,
    handleSearchChange,
    showPagination,
    clearFilters,
    data,
    getRowClassName,
    examineDialogConfig,
    handleOpenExamineDialog,
    handleCloseExamineDialog,
    setExamineDialogConfig,
    finalData,
    handleCompleteLocomotiveAction,
    handleCloseExamineDialogWithRefresh,
    handleDateRangeChange,
    handleDeleteLocomotiveAction,
    viewDetailsDialogConfig,
    handleOpenViewDetailsDialog,
    handleCloseViewDetailsDialog,
    setViewDetailsDialogConfig,
    actionsForSelectedLocomotive,
    examineEditDialogConfig,
    handleOpenExamineEditDialog,
    handleCloseExamineEditDialog,
    setExamineEditDialogConfig,
    EditDocumentEditDialogConfig,
    handleOpenEditDocumentEditDialog,
    handleCloseEditDocumentDialog,
    setEditDocumentEditDialogConfig,
    fetchLocomotiveActionData,
    locomotiveActionData,
    activeDialogConfig,
  };
};

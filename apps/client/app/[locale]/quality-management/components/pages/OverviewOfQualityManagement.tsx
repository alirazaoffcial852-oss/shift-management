"use client";

import * as React from "react";
import CustomerFeedbackDialog from "@/src/modules/quality-management/components/dialogs/CustomerFeedbackDialog";
import EmployeeFeedbackDialog from "@/src/modules/quality-management/components/dialogs/EmployeeFeedbackDialog";
import CompanyFeedbackDialog from "@/src/modules/quality-management/components/dialogs/CompanyFeedbackDialog";
import FilterPill from "@/src/modules/quality-management/components/FilterPill";
import StarRating from "@workspace/ui/components/custom/StarRating";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { TableColumn } from "@workspace/ui/types/smsTable";
import QualityManagementService from "@/services/qualityManagement";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import "@/components/Tabs/tabs.css";
import {
  createEmployeeFeedback,
  CreateEmployeeFeedbackPayload,
} from "@/src/modules/quality-management/api/employeeFeedbacks";
import {
  createCustomerFeedback,
  CreateCustomerFeedbackPayload,
} from "@/src/modules/quality-management/api/customerFeedbacks";
import {
  createCompanyFeedback,
  CreateCompanyFeedbackPayload,
} from "@/src/modules/quality-management/api/companyFeedbacks";

type FilterOption = {
  label: string;
  value: any;
};

type RatingFilterValue =
  | { kind: "gte"; threshold: number }
  | { kind: "lte"; threshold: number }
  | { kind: "range"; min: number; max: number }
  | { kind: "missing" };

type FeedbackFilterValue = "has-feedback" | "missing-feedback";

type EmployeeFilterValue = {
  id?: number;
  role: "trainDriver" | "shantingAttendant" | "any";
};

type OverviewRow = {
  id: number | string;
  date: string;
  dateISO?: string;
  customer: string;
  customerId?: number;
  project: string;
  projectId?: number;
  product?: string;
  productId?: number;
  evt?: string;
  evtId?: number;
  company: string;
  companyId?: number;
  trainDriver: string;
  trainDriverId?: number;
  trainDriverRoleId?: number;
  shantingAttendant: string;
  shantingAttendantId?: number;
  shantingAttendantRoleId?: number;
  companyRating: number;
  employeeRating: number;
  customerRating: number;
  shiftType: "regular" | "usn";
};

const normalizeRating = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  const parsed = typeof value === "string" ? parseFloat(value) : Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const extractShiftRating = (
  feedbacks: any[] | undefined,
  shiftId: number | string
) => {
  if (!Array.isArray(feedbacks)) {
    return undefined;
  }
  const numericShiftId = Number(shiftId);

  const match = feedbacks.find(
    (feedback) =>
      feedback?.shift_id === numericShiftId ||
      feedback?.shiftId === numericShiftId ||
      feedback?.shift?.id === numericShiftId ||
      feedback?.usn_shift_id === numericShiftId ||
      feedback?.usnShiftId === numericShiftId ||
      feedback?.usn_shift?.id === numericShiftId
  );

  const rating = match?.overall_rating ?? match?.overallRating;
  return rating !== undefined ? Number(rating) : undefined;
};

const matchesRating = (value: number, rule?: RatingFilterValue | null) => {
  if (!rule) return true;
  if (rule.kind === "missing") {
    return Number.isNaN(value) || value <= 0;
  }
  const numeric = Number.isNaN(value) ? 0 : value;
  if (rule.kind === "gte") {
    return numeric >= rule.threshold;
  }
  if (rule.kind === "lte") {
    return numeric <= rule.threshold;
  }
  if (rule.kind === "range") {
    return numeric >= rule.min && numeric <= rule.max;
  }
  return true;
};

const OverviewOfQualityManagement: React.FC = () => {
  const t = useTranslations("pages.qualityManagement");

  const [shiftType, setShiftType] = React.useState<"regular" | "usn">(
    "regular"
  );
  const [rows, setRows] = React.useState<OverviewRow[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = React.useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const limit = 20;

  // Search and range filters
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchValue = searchTerm.trim().toLowerCase();
  const [dateRange, setDateRange] = React.useState<{
    from?: string;
    to?: string;
  }>({});

  // Dialog states
  const [customerDialogOpen, setCustomerDialogOpen] = React.useState(false);
  const [employeeDialogOpen, setEmployeeDialogOpen] = React.useState(false);
  const [companyDialogOpen, setCompanyDialogOpen] = React.useState(false);

  // Selected row data for dialogs
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  const [filterState, setFilterState] = React.useState<{
    employee: FilterOption | null;
    role: FilterOption | null;
    evt: FilterOption | null;
    customer: FilterOption | null;
    customerRating: FilterOption | null;
    employeeRating: FilterOption | null;
    employeeFeedback: FilterOption | null;
  }>({
    employee: null,
    role: null,
    evt: null,
    customer: null,
    customerRating: null,
    employeeRating: null,
    employeeFeedback: null,
  });

  const resetPagination = React.useCallback(() => {
    setCurrentPage(1);
  }, []);

  const fetchShifts = React.useCallback(
    async (page: number = 1) => {
      setIsLoadingShifts(true);
      try {
        if (shiftType === "regular") {
          const response = await QualityManagementService.getApprovedShifts({
            page,
            limit,
            from_date: dateRange.from,
            to_date: dateRange.to,
          });

          const pagination = response?.data?.pagination || {};
          setTotalPages(pagination.total_pages || 1);
          setTotalCount(pagination.total || 0);

          const shifts = response?.data?.data || [];
          const transformedData: OverviewRow[] = shifts.map((shift: any) => {
            const trainDriverRole = shift.shiftRole?.find(
              (r: any) => r.role?.has_train_driver === true
            );
            const shantingAttendantRole = shift.shiftRole?.find(
              (r: any) => r.role?.has_train_driver === false
            );

            const companyRatingRaw =
              shift.company_rating ??
              extractShiftRating(shift?.company?.companyFeedBacks, shift.id);
            const customerRatingRaw =
              shift.customer_rating ??
              extractShiftRating(shift?.customer?.customerFeedBacks, shift.id);
            const employeeRatingRaw = shift.employee_rating;

            const dateISO = shift.date
              ? new Date(shift.date).toISOString()
              : undefined;
            const evtName =
              shift?.bv_project?.name ??
              shift?.project?.evt_number ??
              shift?.product?.evt_number ??
              "-";

            return {
              id: shift.id,
              date: dateISO ? new Date(dateISO).toLocaleDateString() : "-",
              dateISO,
              customer: shift.customer?.name || "-",
              customerId: shift.customer?.id,
              project: shift.project?.name || "-",
              projectId: shift.project?.id,
              product: shift.product?.name || "-",
              productId: shift.product?.id,
              evt: evtName,
              evtId: shift?.bv_project?.id,
              company: shift.company?.name || "-",
              companyId: shift.company?.id,
              trainDriver:
                trainDriverRole?.shiftPersonnel?.[0]?.employee?.name ||
                trainDriverRole?.employee?.name ||
                "-",
              trainDriverId:
                trainDriverRole?.shiftPersonnel?.[0]?.employee?.id ||
                trainDriverRole?.employee?.id,
              trainDriverRoleId: trainDriverRole?.role?.id,
              shantingAttendant:
                shantingAttendantRole?.shiftPersonnel?.[0]?.employee?.name ||
                shantingAttendantRole?.employee?.name ||
                "-",
              shantingAttendantId:
                shantingAttendantRole?.shiftPersonnel?.[0]?.employee?.id ||
                shantingAttendantRole?.employee?.id,
              shantingAttendantRoleId: shantingAttendantRole?.role?.id,
              companyRating: normalizeRating(companyRatingRaw),
              employeeRating: normalizeRating(employeeRatingRaw),
              customerRating: normalizeRating(customerRatingRaw),
              shiftType: "regular",
            };
          });

          setRows(transformedData);
        } else {
          const response = await QualityManagementService.getApprovedUsnShifts({
            page,
            limit: 10,
            from_date: dateRange.from,
            to_date: dateRange.to,
          });

          const pagination = response?.data?.pagination || {};
          setTotalPages(pagination.total_pages || 1);
          setTotalCount(pagination.total || 0);

          const shifts = response?.data?.data || [];
          const transformedData: OverviewRow[] = shifts.map((shift: any) => {
            const trainDriverRole = shift.usn_shift_roles?.find(
              (r: any) => r.role?.has_train_driver === true
            );
            const shantingAttendantRole = shift.usn_shift_roles?.find(
              (r: any) => r.role?.has_train_driver === false
            );

            const companyRatingRaw =
              shift.company_rating ??
              extractShiftRating(shift?.company?.companyFeedBacks, shift.id);
            const customerRatingRaw = shift.customer_rating;
            const employeeRatingRaw = shift.employee_rating;
            const dateISO = shift.date
              ? new Date(shift.date).toISOString()
              : undefined;
            const evtName =
              shift.product_usn?.product?.evt_number ||
              shift.product_usn?.evt_number ||
              "-";

            return {
              id: shift.id,
              date: dateISO ? new Date(dateISO).toLocaleDateString() : "-",
              dateISO,
              customer:
                shift.product_usn?.customer?.name || shift.company?.name || "-",
              customerId: shift.product_usn?.customer?.id,
              project: "USN Project",
              projectId: undefined,
              product: shift.product_usn?.product?.name || "-",
              productId: shift.product_usn?.product?.id,
              evt: evtName,
              evtId: shift.product_usn?.id,
              company: shift.company?.name || "-",
              companyId: shift.company?.id,
              trainDriver:
                trainDriverRole?.usn_shift_personnels?.[0]?.employee?.name ||
                "-",
              trainDriverId:
                trainDriverRole?.usn_shift_personnels?.[0]?.employee?.id,
              trainDriverRoleId: trainDriverRole?.role?.id,
              shantingAttendant:
                shantingAttendantRole?.usn_shift_personnels?.[0]?.employee
                  ?.name || "-",
              shantingAttendantId:
                shantingAttendantRole?.usn_shift_personnels?.[0]?.employee?.id,
              shantingAttendantRoleId: shantingAttendantRole?.role?.id,
              companyRating: normalizeRating(companyRatingRaw),
              employeeRating: normalizeRating(employeeRatingRaw),
              customerRating: normalizeRating(customerRatingRaw),
              shiftType: "usn",
            };
          });

          setRows(transformedData);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        toast.error(t("failedToFetchShifts"));
        setRows([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setIsLoadingShifts(false);
      }
    },
    [shiftType, limit, t, dateRange.from, dateRange.to]
  );

  React.useEffect(() => {
    fetchShifts(currentPage);
  }, [currentPage, fetchShifts]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [shiftType]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddCustomerFeedback = (row: any) => {
    setSelectedRow(row);
    setCustomerDialogOpen(true);
  };
  const handleAddEmployeeFeedback = (row: any) => {
    setSelectedRow(row);
    setEmployeeDialogOpen(true);
  };
  const handleAddCompanyFeedback = (row: any) => {
    setSelectedRow(row);
    setCompanyDialogOpen(true);
  };

  const handleCustomerFeedbackSave = async (data: any) => {
    if (!selectedRow?.customerId) {
      toast.error(t("customerIdMissing"));
      return;
    }
    const shiftIdRaw = Number(selectedRow?.id);
    if (!Number.isFinite(shiftIdRaw)) {
      toast.error(t("shiftIdMissing"));
      return;
    }
    const isUsnShift = selectedRow?.shiftType === "usn";

    try {
      const payload: CreateCustomerFeedbackPayload = {
        customer_id: selectedRow.customerId,
      };

      if (isUsnShift) {
        payload.usn_shift_id = shiftIdRaw;
      } else {
        payload.shift_id = shiftIdRaw;
      }

      if (data.travelRating && data.travelRating > 0) {
        payload.travel = String(data.travelRating);
      }
      if (data.accommodationRating && data.accommodationRating > 0) {
        payload.accommodation = String(data.accommodationRating);
      }
      if (data.notes && data.notes.trim() !== "") {
        payload.notes = data.notes;
      }

      await createCustomerFeedback(payload);
      toast.success(t("customerFeedbackSaved"));
      setCustomerDialogOpen(false);
      fetchShifts(currentPage);
    } catch (error: any) {
      console.error("Error saving customer feedback:", error);
      toast.error(error.message || t("failedToSaveCustomerFeedback"));
    }
  };

  const batchSaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleEmployeeFeedbackSave = async (data: any) => {
    if (!data.employeeId) {
      toast.error(t("employeeIdMissing"));
      return;
    }

    try {
      const payload: CreateEmployeeFeedbackPayload = {
        employee_id: data.employeeId,
      };

      if (data.overallRating && data.overallRating > 0) {
        payload.overall_rating = String(data.overallRating);
      }
      if (data.expertiseRating && data.expertiseRating > 0) {
        payload.expertise = String(data.expertiseRating);
      }
      if (data.punctualityRating && data.punctualityRating > 0) {
        payload.punctuality = String(data.punctualityRating);
      }
      if (data.speedRating && data.speedRating > 0) {
        payload.speed = String(data.speedRating);
      }
      if (data.notes && data.notes.trim() !== "") {
        payload.notes = data.notes;
      }

      if (data.makeAllSame) {
        createEmployeeFeedback(payload).catch((error: any) => {
          console.error("Error saving employee feedback:", error);
          toast.error(error.message || t("failedToSaveEmployeeFeedback"));
        });

        if (batchSaveTimeoutRef.current) {
          clearTimeout(batchSaveTimeoutRef.current);
        }

        batchSaveTimeoutRef.current = setTimeout(() => {
          setEmployeeDialogOpen(false);
          fetchShifts(currentPage);
          batchSaveTimeoutRef.current = null;
        }, 2000);
      } else {
        await createEmployeeFeedback(payload);
        toast.success(t("employeeFeedbackSaved"));
        setEmployeeDialogOpen(false);
        fetchShifts(currentPage);
      }
    } catch (error: any) {
      console.error("Error saving employee feedback:", error);
      toast.error(error.message || t("failedToSaveEmployeeFeedback"));
    }
  };

  const handleCompanyFeedbackSave = async (data: any) => {
    if (!selectedRow?.companyId) {
      toast.error(t("companyIdMissing"));
      return;
    }
    const shiftIdRaw = Number(selectedRow?.id);
    if (!Number.isFinite(shiftIdRaw)) {
      toast.error(t("shiftIdMissing"));
      return;
    }
    const isUsnShift = selectedRow?.shiftType === "usn";

    try {
      const payload: CreateCompanyFeedbackPayload = {
        company_id: selectedRow.companyId,
      };

      if (isUsnShift) {
        payload.usn_shift_id = shiftIdRaw;
      } else {
        payload.shift_id = shiftIdRaw;
      }

      if (data.travelRating && data.travelRating > 0) {
        payload.travel = String(data.travelRating);
      }
      if (data.accommodationRating && data.accommodationRating > 0) {
        payload.accommodation = String(data.accommodationRating);
      }
      if (data.notes && data.notes.trim() !== "") {
        payload.notes = data.notes;
      }

      await createCompanyFeedback(payload);
      toast.success(t("companyFeedbackSaved"));
      setCompanyDialogOpen(false);
      fetchShifts(currentPage);
    } catch (error: any) {
      console.error("Error saving company feedback:", error);
      toast.error(error.message || t("failedToSaveCompanyFeedback"));
    }
  };

  const filtersActive = React.useMemo(() => {
    return (
      searchValue.length > 0 ||
      Object.values(filterState).some((option) => option !== null) ||
      dateRange.from !== undefined ||
      dateRange.to !== undefined
    );
  }, [filterState, searchValue, dateRange.from, dateRange.to]);

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const {
        employee,
        role,
        evt,
        customer,
        customerRating,
        employeeRating,
        employeeFeedback,
      } = filterState;

      if (employee?.value) {
        const value = employee.value as EmployeeFilterValue;
        const id = value.id;
        const roleType = value.role;
        if (id) {
          if (roleType === "trainDriver" && row.trainDriverId !== id) {
            return false;
          }
          if (
            roleType === "shantingAttendant" &&
            row.shantingAttendantId !== id
          ) {
            return false;
          }
          if (
            roleType === "any" &&
            row.trainDriverId !== id &&
            row.shantingAttendantId !== id
          ) {
            return false;
          }
        } else if (employee.label) {
          const matchByName = [row.trainDriver, row.shantingAttendant]
            .filter(Boolean)
            .some(
              (name) => name?.toLowerCase() === employee.label.toLowerCase()
            );
          if (!matchByName) {
            return false;
          }
        }
      }

      if (role?.value) {
        if (
          role.value === "trainDriver" &&
          (!row.trainDriver || row.trainDriver === "-")
        ) {
          return false;
        }
        if (
          role.value === "shantingAttendant" &&
          (!row.shantingAttendant || row.shantingAttendant === "-")
        ) {
          return false;
        }
      }

      if (evt?.value) {
        if ((row.evt || "-") !== evt.value) {
          return false;
        }
      }

      if (customer?.value !== undefined && customer?.value !== null) {
        if (typeof customer.value === "number") {
          if (row.customerId !== customer.value) {
            return false;
          }
        } else if (
          row.customer.toLowerCase() !== String(customer.value).toLowerCase()
        ) {
          return false;
        }
      }

      if (customerRating?.value) {
        if (!matchesRating(row.customerRating, customerRating.value)) {
          return false;
        }
      }

      if (employeeRating?.value) {
        if (!matchesRating(row.employeeRating, employeeRating.value)) {
          return false;
        }
      }

      if (employeeFeedback?.value) {
        const hasFeedback = row.employeeRating > 0;
        if (employeeFeedback.value === "has-feedback" && !hasFeedback) {
          return false;
        }
        if (employeeFeedback.value === "missing-feedback" && hasFeedback) {
          return false;
        }
      }

      if (dateRange.from && row.dateISO) {
        if (new Date(row.dateISO) < new Date(dateRange.from)) {
          return false;
        }
      }

      if (dateRange.to && row.dateISO) {
        if (new Date(row.dateISO) > new Date(dateRange.to)) {
          return false;
        }
      }

      if (!searchValue) {
        return true;
      }

      const haystack = [
        row.date,
        row.customer,
        row.project,
        row.company,
        row.trainDriver,
        row.shantingAttendant,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchValue);
    });
  }, [rows, filterState, dateRange.from, dateRange.to, searchValue]);

  const employeeOptions = React.useMemo<FilterOption[]>(() => {
    const map = new Map<string, FilterOption>();
    rows.forEach((row) => {
      if (row.trainDriver && row.trainDriver !== "-") {
        const key = `train-${row.trainDriverId ?? row.trainDriver}`;
        map.set(key, {
          label: row.trainDriver,
          value: {
            id: row.trainDriverId,
            role: "trainDriver",
          } satisfies EmployeeFilterValue,
        });
      }
      if (row.shantingAttendant && row.shantingAttendant !== "-") {
        const key = `shant-${row.shantingAttendantId ?? row.shantingAttendant}`;
        map.set(key, {
          label: row.shantingAttendant,
          value: {
            id: row.shantingAttendantId,
            role: "shantingAttendant",
          } satisfies EmployeeFilterValue,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [rows]);

  const roleOptions = React.useMemo<FilterOption[]>(
    () => [
      { label: t("trainDriver"), value: "trainDriver" },
      { label: t("shantingAttendant"), value: "shantingAttendant" },
    ],
    [t]
  );

  const evtOptions = React.useMemo<FilterOption[]>(() => {
    const set = new Set<string>();
    rows.forEach((row) => {
      if (row.evt && row.evt !== "-") {
        set.add(row.evt);
      }
    });
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((evt) => ({ label: evt, value: evt }));
  }, [rows]);

  const customerOptions = React.useMemo<FilterOption[]>(() => {
    const map = new Map<number | string, FilterOption>();
    rows.forEach((row) => {
      if (row.customerId) {
        map.set(row.customerId, {
          label: row.customer,
          value: row.customerId,
        });
      } else if (row.customer && row.customer !== "-") {
        map.set(row.customer, {
          label: row.customer,
          value: row.customer,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [rows]);

  const ratingOptions = React.useMemo<FilterOption[]>(
    () => [
      { label: "≥ 4.5", value: { kind: "gte", threshold: 4.5 } },
      { label: "≥ 4.0", value: { kind: "gte", threshold: 4.0 } },
      { label: "0 – 3.9", value: { kind: "range", min: 0, max: 3.9 } },
      { label: "No rating", value: { kind: "missing" } },
    ],
    []
  );

  const employeeFeedbackOptions = React.useMemo<FilterOption[]>(
    () => [
      { label: "Has feedback", value: "has-feedback" },
      { label: "Missing feedback", value: "missing-feedback" },
    ],
    []
  );

  const dataToRender = filtersActive ? filteredRows : rows;
  const computedTotalPages = filtersActive
    ? Math.max(1, Math.ceil(dataToRender.length / limit))
    : totalPages;

  return (
    <div className="space-y-6 px-3 sm:px-6 pb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 overflow-visible py-6">
        <h1 className="font-semibold text-2xl md:text-3xl text-[#2B2B2B]">
          {t("overview")}
        </h1>

        <div className="sms-radio-inputs w-full max-w-full md:!w-[320px]">
          <label className="sms-radio">
            <input
              checked={shiftType === "regular"}
              name="shift-type-radio"
              type="radio"
              onChange={() => setShiftType("regular")}
            />
            <span className="name">{t("regularShift")}</span>
          </label>
          <label className="sms-radio">
            <input
              checked={shiftType === "usn"}
              name="shift-type-radio"
              type="radio"
              onChange={() => setShiftType("usn")}
            />
            <span className="name">{t("usnShift")}</span>
          </label>
        </div>
      </div>

      <SMSTable
        columns={
          [
            { header: t("date"), accessor: "date", className: "w-[120px]" },
            {
              header: t("customer"),
              accessor: "customer",
              className: "w-[160px]",
            },
            {
              header: t("project"),
              accessor: "project",
              className: "w-[160px]",
            },
            {
              header: t("trainDriver"),
              accessor: "trainDriver",
              className: "w-[180px]",
            },
            {
              header: t("shantingAttendant"),
              accessor: "shantingAttendant",
              className: "w-[200px]",
            },
            {
              header: t("companyRating"),
              accessor: "companyRating",
              render: (v) => <StarRating value={Number(v) || 0} size={18} />,
            },
            {
              header: t("employeeRating"),
              accessor: "employeeRating",
              render: (v) => <StarRating value={Number(v) || 0} size={18} />,
            },
            {
              header: t("customerRating"),
              accessor: "customerRating",
              render: (v) => <StarRating value={Number(v) || 0} size={18} />,
            },
          ] as TableColumn[]
        }
        data={dataToRender}
        isLoading={isLoadingShifts}
        actionsHeader={t("actions")}
        actions={[
          {
            label: t("addCustomerFeedback"),
            element: (row: any) => (
              <button
                className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCustomerFeedback(row);
                }}
              >
                <span className="flex items-center gap-2 text-sm text-gray-800">
                  <img
                    src="/images/Edit.png"
                    alt={t("addCustomerFeedback")}
                    className="w-5 h-5"
                  />
                  {t("addCustomerFeedback")}
                </span>
              </button>
            ),
          },
          {
            label: t("addEmployeeFeedback"),
            element: (row: any) => (
              <button
                className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddEmployeeFeedback(row);
                }}
              >
                <span className="flex items-center gap-2 text-sm text-gray-800">
                  <img
                    src="/images/Edit.png"
                    alt={t("addEmployeeFeedback")}
                    className="w-5 h-5"
                  />
                  {t("addEmployeeFeedback")}
                </span>
              </button>
            ),
          },
          {
            label: t("addCompanyFeedback"),
            element: (row: any) => (
              <button
                className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCompanyFeedback(row);
                }}
              >
                <span className="flex items-center gap-2 text-sm text-gray-800">
                  <img
                    src="/images/Edit.png"
                    alt={t("addCompanyFeedback")}
                    className="w-5 h-5"
                  />
                  {t("addCompanyFeedback")}
                </span>
              </button>
            ),
          },
        ]}
        pagination={true}
        currentPage={currentPage}
        totalPages={computedTotalPages}
        onPageChange={handlePageChange}
        search={true}
        dateTimeFilter={true}
        onSearchChange={handleSearchChange}
        onDateRangeChange={(range) => {
          if (!range) {
            setDateRange({});
            return;
          }
          const { from, to } = range as any;
          setDateRange({
            from: from?.toISOString?.(),
            to: to?.toISOString?.(),
          });
        }}
        className="text-[13px]"
        headerBottomContent={
          <div className="flex flex-wrap items-center gap-3">
            <FilterPill
              label={t("employees")}
              options={employeeOptions}
              value={filterState.employee}
              onChange={(option) => {
                setFilterState((prev) => ({ ...prev, employee: option }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("employeeRole")}
              options={roleOptions}
              value={filterState.role}
              onChange={(option) => {
                setFilterState((prev) => ({ ...prev, role: option }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("evt")}
              options={evtOptions}
              value={filterState.evt}
              onChange={(option) => {
                setFilterState((prev) => ({ ...prev, evt: option }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("customer")}
              options={customerOptions}
              value={filterState.customer}
              onChange={(option) => {
                setFilterState((prev) => ({ ...prev, customer: option }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("custRating")}
              options={ratingOptions}
              value={filterState.customerRating}
              onChange={(option) => {
                setFilterState((prev) => ({
                  ...prev,
                  customerRating: option,
                }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("employeeRating")}
              options={ratingOptions}
              value={filterState.employeeRating}
              onChange={(option) => {
                setFilterState((prev) => ({
                  ...prev,
                  employeeRating: option,
                }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("employees_feedbacks")}
              options={employeeFeedbackOptions}
              value={filterState.employeeFeedback}
              onChange={(option) => {
                setFilterState((prev) => ({
                  ...prev,
                  employeeFeedback: option,
                }));
                resetPagination();
              }}
            />
          </div>
        }
      />

      <CustomerFeedbackDialog
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
        customerName={selectedRow?.customer || "Customer Name"}
        onSave={handleCustomerFeedbackSave}
      />

      <EmployeeFeedbackDialog
        open={employeeDialogOpen}
        onOpenChange={setEmployeeDialogOpen}
        trainDriverName={selectedRow?.trainDriver || "Train Driver Name"}
        shantingAttendantName={
          selectedRow?.shantingAttendant || "Shanting Attendant Name"
        }
        onSave={handleEmployeeFeedbackSave}
      />

      <CompanyFeedbackDialog
        open={companyDialogOpen}
        onOpenChange={setCompanyDialogOpen}
        companyName={selectedRow?.company || "Company Name"}
        onSave={handleCompanyFeedbackSave}
      />
    </div>
  );
};

export default OverviewOfQualityManagement;

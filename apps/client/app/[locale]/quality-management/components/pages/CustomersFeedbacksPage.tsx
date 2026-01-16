"use client";

import * as React from "react";
import ActionMenu from "@/src/modules/quality-management/components/ActionMenu";
import FilterPill from "@/src/modules/quality-management/components/FilterPill";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { TableColumn } from "@workspace/ui/types/smsTable";
import QualityManagementService from "@/services/qualityManagement";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import "@/components/Tabs/tabs.css";

type FilterOption = {
  label: string;
  value: any;
};

type FeedbackFilterValue = "has-feedback" | "missing-feedback";

type CustomerFeedbackRow = {
  id: number | string;
  date: string;
  dateISO?: string;
  customer: string;
  customerId?: number;
  customerRole: string;
  evt?: string;
  evtId?: number;
  project: string;
  projectId?: number;
  product?: string;
  productId?: number;
  trainDriver: string;
  trainDriverId?: number;
  shantingAttendant: string;
  shantingAttendantId?: number;
  customerRating: number;
  hasCustomerFeedback: boolean;
};

const normalizeRating = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  const parsed = typeof value === "string" ? parseFloat(value) : Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const extractShiftRating = (feedbacks: any[] | undefined, shiftId: number) => {
  if (!Array.isArray(feedbacks)) {
    return undefined;
  }

  const match = feedbacks.find(
    (feedback) =>
      feedback?.shift_id === shiftId ||
      feedback?.shiftId === shiftId ||
      feedback?.shift?.id === shiftId
  );

  return match?.overall_rating ?? match?.overallRating;
};

const CustomersFeedbacksPage: React.FC = () => {
  const t = useTranslations("pages.qualityManagement");

  const [shiftType, setShiftType] = React.useState<"regular" | "usn">(
    "regular"
  );
  const [rows, setRows] = React.useState<CustomerFeedbackRow[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const limit = 20;

  const [searchTerm, setSearchTerm] = React.useState("");
  const searchValue = searchTerm.trim().toLowerCase();
  const [dateRange, setDateRange] = React.useState<{
    from?: string;
    to?: string;
  }>({});

  const [filterState, setFilterState] = React.useState<{
    customer: FilterOption | null;
    customerRole: FilterOption | null;
    evt: FilterOption | null;
    project: FilterOption | null;
    product: FilterOption | null;
    customerFeedback: FilterOption | null;
  }>({
    customer: null,
    customerRole: null,
    evt: null,
    project: null,
    product: null,
    customerFeedback: null,
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
          const transformedData: CustomerFeedbackRow[] = shifts.map(
            (shift: any) => {
              const trainDriverRole = shift.shiftRole?.find(
                (r: any) => r.role?.has_train_driver === true
              );
              const shantingAttendantRole = shift.shiftRole?.find(
                (r: any) => r.role?.has_train_driver === false
              );

              const customerRatingRaw =
                shift.customer_rating ??
                extractShiftRating(
                  shift?.customer?.customerFeedBacks,
                  shift.id
                );

              const dateISO = shift.date
                ? new Date(shift.date).toISOString()
                : undefined;
              const evtName =
                shift?.bv_project?.name ??
                shift?.project?.evt_number ??
                shift?.product?.evt_number ??
                "-";
              const customerRoleName =
                shift.customer?.contact_person_role?.name ||
                shift.customer?.role?.name ||
                shift.customer?.type ||
                "Unknown";

              return {
                id: shift.id,
                date: dateISO ? new Date(dateISO).toLocaleDateString() : "-",
                dateISO,
                customer: shift.customer?.name || "-",
                customerId: shift.customer?.id,
                customerRole: customerRoleName,
                project: shift.project?.name || "-",
                projectId: shift.project?.id,
                product: shift.product?.name || "-",
                productId: shift.product?.id,
                evt: evtName,
                evtId: shift?.bv_project?.id,
                trainDriver:
                  trainDriverRole?.shiftPersonnel?.[0]?.employee?.name ||
                  trainDriverRole?.employee?.name ||
                  "-",
                trainDriverId:
                  trainDriverRole?.shiftPersonnel?.[0]?.employee?.id ||
                  trainDriverRole?.employee?.id,
                shantingAttendant:
                  shantingAttendantRole?.shiftPersonnel?.[0]?.employee?.name ||
                  shantingAttendantRole?.employee?.name ||
                  "-",
                shantingAttendantId:
                  shantingAttendantRole?.shiftPersonnel?.[0]?.employee?.id ||
                  shantingAttendantRole?.employee?.id,
                customerRating: normalizeRating(customerRatingRaw),
                hasCustomerFeedback: normalizeRating(customerRatingRaw) > 0,
              };
            }
          );

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
          const transformedData: CustomerFeedbackRow[] = shifts.map(
            (shift: any) => {
              const trainDriverRole = shift.usn_shift_roles?.find(
                (r: any) => r.role?.has_train_driver === true
              );
              const shantingAttendantRole = shift.usn_shift_roles?.find(
                (r: any) => r.role?.has_train_driver === false
              );

              const dateISO = shift.date
                ? new Date(shift.date).toISOString()
                : undefined;
              const customerRatingRaw = shift.customer_rating;
              const evtName =
                shift.product_usn?.product?.evt_number ||
                shift.product_usn?.evt_number ||
                "-";

              return {
                id: shift.id,
                date: dateISO ? new Date(dateISO).toLocaleDateString() : "-",
                dateISO,
                customer:
                  shift.product_usn?.customer?.name ||
                  shift.company?.name ||
                  "-",
                customerId: shift.product_usn?.customer?.id,
                customerRole:
                  shift.product_usn?.customer?.contact_person_role?.name ||
                  "Unknown",
                project: "USN Project",
                projectId: undefined,
                product: shift.product_usn?.product?.name || "-",
                productId: shift.product_usn?.product?.id,
                evt: evtName,
                evtId: shift.product_usn?.id,
                trainDriver:
                  trainDriverRole?.usn_shift_personnels?.[0]?.employee?.name ||
                  "-",
                trainDriverId:
                  trainDriverRole?.usn_shift_personnels?.[0]?.employee?.id,
                shantingAttendant:
                  shantingAttendantRole?.usn_shift_personnels?.[0]?.employee
                    ?.name || "-",
                shantingAttendantId:
                  shantingAttendantRole?.usn_shift_personnels?.[0]?.employee
                    ?.id,
                customerRating: normalizeRating(customerRatingRaw),
                hasCustomerFeedback: normalizeRating(customerRatingRaw) > 0,
              };
            }
          );

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
        customer,
        customerRole,
        evt,
        project,
        product,
        customerFeedback,
      } = filterState;

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

      if (customerRole?.value) {
        if (row.customerRole !== customerRole.value) {
          return false;
        }
      }

      if (evt?.value) {
        if ((row.evt || "-") !== evt.value) {
          return false;
        }
      }

      if (project?.value) {
        if ((row.project || "-") !== project.value) {
          return false;
        }
      }

      if (product?.value) {
        if ((row.product || "-") !== product.value) {
          return false;
        }
      }

      if (customerFeedback?.value) {
        if (
          customerFeedback.value === "has-feedback" &&
          !row.hasCustomerFeedback
        ) {
          return false;
        }
        if (
          customerFeedback.value === "missing-feedback" &&
          row.hasCustomerFeedback
        ) {
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
        row.product,
        row.trainDriver,
        row.shantingAttendant,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchValue);
    });
  }, [rows, filterState, dateRange.from, dateRange.to, searchValue]);

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

  const customerRoleOptions = React.useMemo<FilterOption[]>(() => {
    const set = new Set<string>();
    rows.forEach((row) => {
      if (row.customerRole) {
        set.add(row.customerRole);
      }
    });
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((role) => ({ label: role, value: role }));
  }, [rows]);

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

  const projectOptions = React.useMemo<FilterOption[]>(() => {
    const set = new Set<string>();
    rows.forEach((row) => {
      if (row.project && row.project !== "-") {
        set.add(row.project);
      }
    });
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((project) => ({ label: project, value: project }));
  }, [rows]);

  const productOptions = React.useMemo<FilterOption[]>(() => {
    const set = new Set<string>();
    rows.forEach((row) => {
      if (row.product && row.product !== "-") {
        set.add(row.product);
      }
    });
    return Array.from(set)
      .sort((a, b) => a.localeCompare(b))
      .map((product) => ({ label: product, value: product }));
  }, [rows]);

  const feedbackOptions = React.useMemo<FilterOption[]>(
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

  const columns: TableColumn[] = [
    { header: t("date"), accessor: "date", className: "w-[120px]" },
    { header: t("customer"), accessor: "customer", className: "w-[160px]" },
    { header: t("project"), accessor: "project", className: "w-[160px]" },
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
  ];

  const actions = [
    {
      label: t("action"),
      element: () => <ActionMenu />,
    },
  ];

  return (
    <div className="space-y-6 px-6 pb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 overflow-visible py-6">
        <h1 className="font-semibold text-2xl md:text-3xl text-[#2B2B2B]">
          {t("customers_feedbacks")}
        </h1>

        <div className="sms-radio-inputs w-full max-w-full md:!w-[320px]">
          <label className="sms-radio">
            <input
              checked={shiftType === "regular"}
              name="shift-type-radio-customers"
              type="radio"
              onChange={() => setShiftType("regular")}
            />
            <span className="name">{t("regularShift")}</span>
          </label>
          <label className="sms-radio">
            <input
              checked={shiftType === "usn"}
              name="shift-type-radio-customers"
              type="radio"
              onChange={() => setShiftType("usn")}
            />
            <span className="name">{t("usnShift")}</span>
          </label>
        </div>
      </div>

      <SMSTable
        columns={columns}
        data={dataToRender}
        actions={actions}
        actionsHeader={t("actions")}
        isLoading={isLoadingShifts}
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
          <div className="flex flex-wrap items-center gap-3 px-4 md:px-0 py-2">
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
              label={`${t("customer")} Role`}
              options={customerRoleOptions}
              value={filterState.customerRole}
              onChange={(option) => {
                setFilterState((prev) => ({ ...prev, customerRole: option }));
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
              label={t("project")}
              options={projectOptions}
              value={filterState.project}
              onChange={(option) => {
                setFilterState((prev) => ({ ...prev, project: option }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("product")}
              options={productOptions}
              value={filterState.product}
              onChange={(option) => {
                setFilterState((prev) => ({ ...prev, product: option }));
                resetPagination();
              }}
            />
            <FilterPill
              label={t("custFeedbacks")}
              options={feedbackOptions}
              value={filterState.customerFeedback}
              onChange={(option) => {
                setFilterState((prev) => ({
                  ...prev,
                  customerFeedback: option,
                }));
                resetPagination();
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default CustomersFeedbacksPage;

"use client";

import * as React from "react";
import ActionMenu from "../components/ActionMenu";
import { useCompanyFeedbacks } from "../hooks/useCompanyFeedbacks";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { TableColumn } from "@workspace/ui/types/smsTable";
import QualityManagementService from "@/services/qualityManagement";
import { toast } from "sonner";
import "@/components/Tabs/tabs.css";

/**
 * Lightweight dropdown pill component
 */
const PillDropdown: React.FC<{
  label: string;
  options?: string[];
  onSelect?: (value: string) => void;
}> = ({ label, options = [], onSelect }) => {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((s) => !s);

  return (
    <div className="relative inline-block mr-2">
      <button
        onClick={toggle}
        className="h-9 px-3 rounded-full border border-[#E6E6E6] bg-white text-[13px] flex items-center gap-2"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span>{label}</span>
        <svg
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="#6B7280"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-20 mt-2 min-w-[160px] bg-white border border-[#E6E6E6] rounded-md shadow-sm py-2"
          onMouseLeave={() => setOpen(false)}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-[#6B7280]">No options</div>
          ) : (
            options.map((o) => (
              <button
                key={o}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  onSelect?.(o);
                  setOpen(false);
                }}
              >
                {o}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function CompanyFeedbacks() {
  const { data, loading, error, setSearch, setDateRange } =
    useCompanyFeedbacks();

  // Shift type toggle state
  const [shiftType, setShiftType] = React.useState<"regular" | "usn">(
    "regular"
  );
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [isLoadingShifts, setIsLoadingShifts] = React.useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);
  const limit = 20; // Set default limit for regular shifts

  // Local search state
  const [searchTerm, setSearchTerm] = React.useState("");

  // Fetch shifts based on shift type and page
  const fetchShifts = React.useCallback(
    async (page: number = 1) => {
      setIsLoadingShifts(true);
      try {
        if (shiftType === "regular") {
          // Call regular shifts API with pagination
          const response = await QualityManagementService.getApprovedShifts({
            page,
            limit,
          });

          // Extract pagination data
          const pagination = response?.data?.pagination || {};
          setTotalPages(pagination.total_pages || 1);
          setTotalCount(pagination.total || 0);

          // Transform data for table display
          const shifts = response?.data?.data || [];
          const transformedData = shifts.map((shift: any) => {
            // Find train driver role (has_train_driver === true)
            const trainDriverRole = shift.shiftRole?.find(
              (r: any) => r.role?.has_train_driver === true
            );

            // Find shanting attendant role (has_train_driver === false)
            const shantingAttendantRole = shift.shiftRole?.find(
              (r: any) => r.role?.has_train_driver === false
            );

            return {
              id: shift.id,
              date: shift.date
                ? new Date(shift.date).toLocaleDateString()
                : "-",
              company: shift.company?.name || "-",
              project: shift.project?.name || "-",
              trainDriver:
                trainDriverRole?.shiftPersonnel?.[0]?.employee?.name ||
                trainDriverRole?.employee?.name ||
                "-",
              shantingAttendant:
                shantingAttendantRole?.shiftPersonnel?.[0]?.employee?.name ||
                shantingAttendantRole?.employee?.name ||
                "-",
            };
          });
          setTableData(transformedData);
        } else {
          // Call USN shifts API with pagination (limit 10 for USN)
          const response = await QualityManagementService.getApprovedUsnShifts({
            page,
            limit: 10,
          });

          // Extract pagination data
          const pagination = response?.data?.pagination || {};
          setTotalPages(pagination.total_pages || 1);
          setTotalCount(pagination.total || 0);

          // Transform data for table display
          const shifts = response?.data?.data || [];
          const transformedData = shifts.map((shift: any) => {
            // Find train driver role (has_train_driver === true)
            const trainDriverRole = shift.usn_shift_roles?.find(
              (r: any) => r.role?.has_train_driver === true
            );

            // Find shanting attendant role (has_train_driver === false)
            const shantingAttendantRole = shift.usn_shift_roles?.find(
              (r: any) => r.role?.has_train_driver === false
            );

            return {
              id: shift.id,
              date: shift.date
                ? new Date(shift.date).toLocaleDateString()
                : "-",
              company: shift.company?.name || "-",
              project: "USN Project",
              trainDriver:
                trainDriverRole?.usn_shift_personnels?.[0]?.employee?.name ||
                "-",
              shantingAttendant:
                shantingAttendantRole?.usn_shift_personnels?.[0]?.employee
                  ?.name || "-",
            };
          });
          setTableData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        toast.error("Failed to fetch shifts");
        setTableData([]);
        setTotalPages(1);
        setTotalCount(0);
      } finally {
        setIsLoadingShifts(false);
      }
    },
    [shiftType, limit]
  );

  // Fetch shifts when page changes
  React.useEffect(() => {
    fetchShifts(currentPage);
  }, [currentPage, fetchShifts]);

  // Reset to page 1 when shift type changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [shiftType]);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSearch(value); // Also update the hook state for consistency
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: TableColumn[] = [
    { header: "Date", accessor: "date", className: "w-[120px]" },
    { header: "Company", accessor: "company", className: "w-[160px]" },
    { header: "Project", accessor: "project", className: "w-[160px]" },
    { header: "Train Driver", accessor: "trainDriver", className: "w-[180px]" },
    {
      header: "Shanting Attendant",
      accessor: "shantingAttendant",
      className: "w-[200px]",
    },
  ];

  const actions = [
    {
      label: "Actions",
      element: () => <ActionMenu />,
    },
  ];

  return (
    <div className="space-y-6 px-6 pb-8">
      {/* Header with Tabs Toggle */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 overflow-visible py-6">
        <h1 className="font-semibold text-2xl md:text-3xl text-[#2B2B2B]">
          Company Feedbacks
        </h1>

        {/* Shift Type Toggle using existing tabs styling */}
        <div className="sms-radio-inputs w-full max-w-full md:!w-[320px]">
          <label className="sms-radio">
            <input
              checked={shiftType === "regular"}
              name="shift-type-radio-company"
              type="radio"
              onChange={() => setShiftType("regular")}
            />
            <span className="name">Regular Shift</span>
          </label>
          <label className="sms-radio">
            <input
              checked={shiftType === "usn"}
              name="shift-type-radio-company"
              type="radio"
              onChange={() => setShiftType("usn")}
            />
            <span className="name">USN Shift</span>
          </label>
        </div>
      </div>

      <SMSTable
        columns={columns}
        data={tableData}
        actions={actions}
        isLoading={isLoadingShifts}
        pagination={true}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        search={true}
        dateTimeFilter={true}
        onSearchChange={handleSearchChange}
        onDateRangeChange={(range) => {
          if (!range) return;
          const { from, to } = range as any;
          setDateRange(
            from?.toISOString?.() || undefined,
            to?.toISOString?.() || undefined
          );
        }}
        className="text-[13px]"
        headerBottomContent={
          <div className="flex flex-wrap items-center gap-3 px-4 md:px-0 py-2">
            <PillDropdown
              label="Employees"
              options={["Option 1", "Option 2"]}
            />
            <PillDropdown
              label="Employee Role"
              options={["Option 1", "Option 2"]}
            />
            <PillDropdown label="EVT" options={["Option 1", "Option 2"]} />
            <PillDropdown label="Project" options={["Option 1", "Option 2"]} />
            <PillDropdown label="Product" options={["Option 1", "Option 2"]} />

            <PillDropdown
              label="Company Rating"
              options={["Option 1", "Option 2"]}
            />
            <PillDropdown
              label="Company Feedbacks"
              options={["Option 1", "Option 2"]}
            />
          </div>
        }
      />
    </div>
  );
}

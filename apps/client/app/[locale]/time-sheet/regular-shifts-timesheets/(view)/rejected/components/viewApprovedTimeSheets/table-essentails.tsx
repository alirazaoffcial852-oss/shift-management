import { Timesheet } from "@/types/timeSheet";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => [
  {
    header: t("tableHeaders.employee"),
    accessor: "employee.name",
  },
  {
    header: t("tableHeaders.date"),
    accessor: "shift.date",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: t("tableHeaders.workTime"),
    accessor: "start_time",
    render: (value: string, row: any) => `${row.start_time} - ${row.end_time}`,
  },
  {
    header: t("tableHeaders.breakDuration"),
    accessor: "break_duration",
    render: (value: string) => `${value} min`,
  },
  {
    header: "Rejection Reason",
    accessor: "rejectionHistory",
    render: (history: any[]) => {
      return history && history.length > 0
        ? history[history.length - 1].reason
        : "No reason provided";
    },
  },
  {
    header: t("tableHeaders.rejectedBy"),
    accessor: "rejectionHistory",
    render: (history: any[]) => {
      return history && history.length > 0
        ? history[history.length - 1].name
        : "N/A";
    },
  },
  {
    header: t("tableHeaders.customer"),
    accessor: "shift.customer.name",
  },
  {
    header: t("tableHeaders.project"),
    accessor: "shift.project.name",
  },
  {
    header: t("tableHeaders.workType"),
    accessor: "work_type",
    render: (value: any, row: any) => {
      const types = [];
      if (row.is_night_shift) types.push("Night");
      if (row.is_holiday) types.push("Holiday");
      if (row.has_extra_hours) types.push("Overtime");
      return types.length > 0 ? types.join(", ") : "Regular";
    },
  },
  {
    header: t("tableHeaders.status"),
    accessor: "status",
  },
  {
    header: t("tableHeaders.createdBy"),
    accessor: "creator.name",
  },
];

export const COLUMNS = getColumns((key: string) => key);

export const ACTIONS = [
  {
    label: "Edit",
    element: (timesheet: Timesheet) => (
      <Link
        href={`/time-sheet/regular-shifts-timesheets/${timesheet.id}/edit`}
        className="w-full block py-2 px-3 hover:bg-green-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Edit2Icon className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600">Edit</span>
        </span>
      </Link>
    ),
  },
];

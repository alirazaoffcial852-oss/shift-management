import { Badge } from "@workspace/ui/components/badge";
import { Edit2Icon } from "lucide-react";
import Link from "next/link";
import { Timesheet } from "@/types/timeSheet";

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => [
  {
    header: t("tableHeaders.employee"),
    accessor: "employee.name",
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    header: t("tableHeaders.date"),
    accessor: "usn_shift.date",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: t("tableHeaders.shiftTime"),
    accessor: "start_time",
    render: (value: string, row: any) => `${row.start_time} - ${row.end_time}`,
  },
  {
    header: t("tableHeaders.breakDuration"),
    accessor: "break_duration",
    render: (value: string) => `${value} min`,
  },
  {
    header: t("tableHeaders.company"),
    accessor: "usn_shift.company.name",
  },
  {
    header: t("tableHeaders.status"),
    accessor: "status",
    render: (value: string) => {
      const statusColors = {
        SUBMITTED: "bg-blue-100 text-blue-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        DRAFT: "bg-gray-100 text-gray-800",
      };

      return (
        <Badge
          className={`${statusColors[value as keyof typeof statusColors]} border-0`}
        >
          {value}
        </Badge>
      );
    },
  },
  {
    header: t("tableHeaders.createdBy"),
    accessor: "creator.name",
    render: (value: string) => (
      <span className="text-sm text-gray-600">{value || "N/A"}</span>
    ),
  },
  {
    header: t("tableHeaders.createdAt"),
    accessor: "created_at",
    render: (value: string) => (
      <span className="text-sm text-gray-600">
        {new Date(value).toLocaleDateString()}
      </span>
    ),
  },
];

export const COLUMNS = getColumns((key: string) => key);

export const ACTIONS = [
  {
    label: "Edit",
    element: (timesheet: Timesheet) => (
      <Link
        href={`/time-sheet/usn-shifts-timesheets/${timesheet.id}/edit`}
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

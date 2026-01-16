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
    header: t("tableHeaders.customer"),
    accessor: "shift.customer.name",
  },
  {
    header: t("tableHeaders.project"),
    accessor: "shift.project.name",
  },
  {
    header: t("tableHeaders.workType"),
    accessor: "flags",
    render: (value: any, row: any) => {
      const flags = [];
      if (row.is_night_shift) flags.push("Night Shift");
      if (row.is_holiday) flags.push("Holiday");
      if (row.has_extra_hours) flags.push("Extra Hours");
      if (row.self_created) flags.push("Self Created");
      return flags.length > 0 ? flags.join(", ") : "Regular";
    },
  },
  {
    header: t("tableHeaders.status"),
    accessor: "status",
  },
  {
    header: t("tableHeaders.approvedBy"),
    accessor: "timesheetApproval",
    render: (approvals: any[]) => {
      return approvals && approvals.length > 0 ? approvals[0].name : "N/A";
    },
  },
  {
    header: t("tableHeaders.approvedAt"),
    accessor: "approved_at",
    render: (value: string) =>
      value ? new Date(value).toLocaleDateString() : "N/A",
  },
  {
    header: t("tableHeaders.createdBy"),
    accessor: "creator.name",
  },
];

export const COLUMNS = getColumns((key: string) => key);

export const MINIMAL_COLUMNS = [
  {
    header: "Employee",
    accessor: "employee.name",
  },
  {
    header: "Date",
    accessor: "shift.date",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: "Time",
    accessor: "start_time",
    render: (value: string, row: any) => `${row.start_time} - ${row.end_time}`,
  },
  {
    header: "Customer",
    accessor: "shift.customer.name",
  },
  {
    header: "Project",
    accessor: "shift.project.name",
  },
  {
    header: "Status",
    accessor: "status",
  },
  {
    header: "Approved By",
    accessor: "timesheetApproval",
    render: (approvals: any[]) => {
      return approvals && approvals.length > 0 ? approvals[0].name : "N/A";
    },
  },
];

export const DETAILED_COLUMNS = [
  {
    header: "Employee",
    accessor: "employee.name",
  },
  {
    header: "Employee Email",
    accessor: "employee.email",
  },
  {
    header: "Shift Date",
    accessor: "shift.date",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: "Work Time",
    accessor: "start_time",
    render: (value: string, row: any) => `${row.start_time} - ${row.end_time}`,
  },
  {
    header: "Scheduled Time",
    accessor: "shift.start_time",
    render: (value: string, row: any) => {
      const start = new Date(row.shift.start_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const end = new Date(row.shift.end_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${start} - ${end}`;
    },
  },
  {
    header: "Break Duration",
    accessor: "break_duration",
    render: (value: string) => `${value} minutes`,
  },
  {
    header: "Customer",
    accessor: "shift.customer.name",
  },
  {
    header: "Project",
    accessor: "shift.project.name",
  },
  {
    header: "Work Type",
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
    header: "Creation Method",
    accessor: "self_created",
    render: (value: boolean) => (value ? "Self Created" : "Admin Created"),
  },
  {
    header: "Status",
    accessor: "status",
  },
  {
    header: "Approved By",
    accessor: "timesheetApproval",
    render: (approvals: any[]) => {
      return approvals && approvals.length > 0
        ? approvals[0].name
        : "Not Available";
    },
  },
  {
    header: "Approval Date",
    accessor: "approved_at",
    render: (value: string) => {
      return value ? new Date(value).toLocaleDateString() : "Not Available";
    },
  },
  {
    header: "Created By",
    accessor: "creator.name",
  },
  {
    header: "Creation Date",
    accessor: "created_at",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: "Notes",
    accessor: "notes",
    render: (value: string) => value || "No notes",
  },
];

export const ACTIONS = [];

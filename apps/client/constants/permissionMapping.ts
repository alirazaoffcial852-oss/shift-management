export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard": [],

  "/customers": ["customer.read"],
  "/customers/add": ["customer.create"],
  "/customers/[id]/edit": ["customer.update"],
  "/customers/[id]": ["customer.read"],

  "/products": ["product.read"],
  "/products/add": ["product.create"],
  "/products/[id]/edit": ["product.update"],
  "/products/[id]": ["product.read"],

  "/projects": ["project.read"],
  "/projects/add": ["project.create"],
  "/projects/[id]/edit": ["project.update"],
  "/projects/[id]": ["project.read"],

  "/bv-projects": ["bv-project.read"],
  "/bv-projects/add": ["bv-project.create"],
  "/bv-projects/[id]/edit": ["bv-project.update"],
  "/bv-projects/[id]": ["bv-project.read"],

  "/employees": ["employee.read"],
  "/employees/add": ["employee.create"],
  "/employees/[id]/edit": ["employee.update"],
  "/employees/[id]": ["employee.read"],

  "/staff": ["staff.read"],
  "/staff/add": ["staff.create"],
  "/staff/[id]/edit": ["staff.update"],
  "/staff/[id]": ["staff.read"],

  "/locomotives": ["locomotive.read"],
  "/locomotives/add": ["locomotive.create"],
  "/locomotives/[id]/edit": ["locomotive.update"],
  "/locomotives/[id]": ["locomotive.read"],

  "/locations": ["location.read"],
  "/locations/add": ["location.create"],
  "/locations/[id]/edit": ["location.update"],
  "/locations/[id]": ["location.read"],

  "/wagon": ["wagon.read"],
  "/wagon/add": ["wagon.create"],
  "/wagon/[id]/edit": ["wagon.update"],
  "/wagon/[id]": ["wagon.read"],

  "/table-wagon-list": ["wagon-list.read"],
  "/wagon-list/add": ["wagon-list.create"],
  "/wagon-list/[id]": ["wagon-list.read"],

  "/track-cost": ["shift-toll-cost.read"],
  "/track-cost/add": ["shift-toll-cost.create"],
  "/track-cost/[id]/edit": ["shift-toll-cost.update"],
  "/track-cost/[id]": ["shift-toll-cost.read"],

  "/history-wagon": ["wagon.read"],

  "/shift-management/regular-shifts": ["shift.read"],
  "/shift-management/regular-shifts/monthly": ["shift.read"],
  "/shift-management/regular-shifts/weekly": ["shift.read"],
  "/shift-management/regular-shifts/add": ["shift.create"],
  "/shift-management/regular-shifts/[id]/edit": ["shift.update"],
  "/shift-management/regular-shifts/trains": ["shift.read"],

  "/shift-management/orders-shifts": ["shift.read"],
  "/shift-management/orders-shifts/monthly": ["shift.read"],
  "/shift-management/orders-shifts/weekly": ["shift.read"],
  "/shift-management/orders-shifts/table": ["shift.read"],
  "/shift-management/orders-shifts/add": ["shift.create"],
  "/shift-management/orders-shifts/[id]/edit": ["shift.update"],

  "/shift-management/project-usn-shifts": ["usn-shift.read"],
  "/shift-management/project-usn-shifts/usn-shifts": ["usn-shift.read"],
  "/shift-management/project-usn-shifts/usn-shifts/monthly": ["usn-shift.read"],
  "/shift-management/project-usn-shifts/usn-shifts/weekly": ["usn-shift.read"],
  "/shift-management/project-usn-shifts/usn-shifts/add": ["usn-shift.create"],
  "/shift-management/project-usn-shifts/usn-shifts/[id]/edit": [
    "usn-shift.update",
  ],
  "/shift-management/project-usn-shifts/usn-shifts/[id]": ["usn-shift.read"],
  "/shift-management/project-usn-shifts/warehouse-shifts": ["usn-shift.read"],
  "/shift-management/project-usn-shifts/warehouse-shifts/monthly": [
    "usn-shift.read",
  ],
  "/shift-management/project-usn-shifts/warehouse-shifts/weekly": [
    "usn-shift.read",
  ],
  "/shift-management/project-usn-shifts/wagon-database": ["wagon.read"],
  "/shift-management/project-usn-shifts/add": ["usn-shift.create"],

  "/time-sheet/regular-shifts-timesheets": ["timesheet.read"],
  "/time-sheet/regular-shifts-timesheets/submitted": ["timesheet.read"],
  "/time-sheet/regular-shifts-timesheets/approved": ["timesheet.read"],
  "/time-sheet/regular-shifts-timesheets/rejected": ["timesheet.read"],
  "/time-sheet/regular-shifts-timesheets/draft": ["timesheet.read"],
  "/time-sheet/regular-shifts-timesheets/add": ["timesheet.create"],
  "/time-sheet/regular-shifts-timesheets/[id]/edit": ["timesheet.update"],

  "/time-sheet/usn-shifts-timesheets": ["timesheet.read"],
  "/time-sheet/usn-shifts-timesheets/submitted": ["timesheet.read"],
  "/time-sheet/usn-shifts-timesheets/approved": ["timesheet.read"],
  "/time-sheet/usn-shifts-timesheets/rejected": ["timesheet.read"],
  "/time-sheet/usn-shifts-timesheets/draft": ["timesheet.read"],
  "/time-sheet/usn-shifts-timesheets/add": ["timesheet.create"],
  "/time-sheet/usn-shifts-timesheets/[id]/edit": ["timesheet.update"],

  "/handover-book": ["handover-book.read"],
  "/handover-book/add": ["handover-book.create"],
  "/handover-book/[id]/edit": ["handover-book.update"],
  "/handover-book/[id]": ["handover-book.read"],
  "/handover-book/usn": ["usn-handover-book.read"],
  "/handover-book/usn/[id]/edit": ["usn-handover-book.update"],

  "/maintenance": ["locomotive-action.read"],
  "/maintenance/overview-of-locomotive": ["locomotive.read"],
  "/maintenance/overview-of-actions": ["locomotive-action.read"],
  "/maintenance/reasons": ["reason.read"],
  "/maintenance/history-of-maintenance": ["locomotive-action.read"],

  "/quality-management": ["quality-management.read"],
  "/quality-management/overview": ["quality-management.read"],
  "/quality-management/topics": ["quality-management.read"],
  "/quality-management/company-feedbacks": ["quality-management.read"],
  "/quality-management/customers-feedbacks": ["quality-management.read"],
  "/quality-management/employees-feedbacks": ["quality-management.read"],

  "/sampling": ["sample.read"],
  "/sampling/add": ["sample.create"],
  "/sampling/[id]/edit": ["sample.update"],
  "/sampling/[id]": ["sample.read"],

  "/request": ["company-request-employee.read"],
  "/request/receive": ["company-request-employee.read"],
  "/request/send": ["company-request-employee.read"],
  "/request/add": ["company-request-employee.create"],
  "/request/[id]/edit": ["company-request-employee.update"],

  "/settings/profile": ["settings.profile"],
  "/settings/company": ["settings.company"],
  "/settings/role": ["settings.role"],
  "/settings/holidays": ["settings.holiday"],
  "/settings/change-password": ["settings.password"],
  "/settings/type-of-operation": ["settings.operation-type"],
  "/settings/cost-center": ["settings.cost-center"],
  "/settings/holidays/add": ["settings.holiday"],
  "/settings/holidays/[id]/edit": ["settings.holiday"],
  "/settings/cost-center/add": ["settings.cost-center"],
  "/settings/cost-center/[id]/edit": ["settings.cost-center"],
  "/settings/type-of-operation/add": ["settings.operation-type"],
  "/settings/type-of-operation/[id]/edit": ["settings.operation-type"],

  "/configuration": ["configuration.read"],
};

export function getRequiredPermissions(path: string): string[] {
  const cleanPath = path.replace(/^\/(en|de|fr|es)/, "");

  if (ROUTE_PERMISSIONS[cleanPath]) {
    return ROUTE_PERMISSIONS[cleanPath];
  }

  for (const [routePath, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
    const pattern = routePath
      .replace(/\[id\]/g, "[^/]+")
      .replace(/\[.*?\]/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);

    if (regex.test(cleanPath)) {
      return permissions;
    }
  }

  const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    cleanPath.startsWith(route)
  );

  if (matchingRoute) {
    return ROUTE_PERMISSIONS[matchingRoute] || [];
  }

  return [];
}

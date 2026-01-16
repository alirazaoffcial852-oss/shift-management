export interface PermissionDependency {
  permission: string;
  requiredPermissions: string[];
  description?: string;
}

export const PERMISSION_DEPENDENCIES: Record<string, string[]> = {
  "user.read": ["company.read"],
  "user.create": ["company.read"],
  "user.update": ["company.read", "user.read"],
  "user.delete": ["company.read", "user.read"],

  "role.read": ["company.read"],
  "role.create": ["company.read"],
  "role.update": ["company.read", "role.read"],
  "role.delete": ["company.read", "role.read"],

  "company.read": [],
  "company.create": ["company.read"],
  "company.update": ["company.read"],
  "company.delete": ["company.read"],

  "customer.read": ["company.read"],
  "customer.create": ["company.read"],
  "customer.update": ["company.read", "customer.read"],
  "customer.delete": ["company.read", "customer.read"],

  "product.read": ["company.read"],
  "product.create": ["company.read"],
  "product.update": ["company.read", "product.read"],
  "product.delete": ["company.read", "product.read"],

  "project.read": ["company.read", "customer.read"],
  "project.create": ["company.read", "customer.read"],
  "project.update": ["company.read", "project.read", "customer.read"],
  "project.delete": ["company.read", "project.read"],

  "bv-project.read": ["company.read", "project.read"],
  "bv-project.create": ["company.read", "project.read"],
  "bv-project.update": ["company.read", "bv-project.read", "project.read"],
  "bv-project.delete": ["company.read", "bv-project.read"],

  "employee.read": ["company.read"],
  "employee.create": ["company.read"],
  "employee.update": ["company.read", "employee.read"],
  "employee.delete": ["company.read", "employee.read"],

  "staff.read": ["company.read"],
  "staff.create": ["company.read"],
  "staff.update": ["company.read", "staff.read"],
  "staff.delete": ["company.read", "staff.read"],

  "locomotive.read": ["company.read"],
  "locomotive.create": ["company.read"],
  "locomotive.update": ["company.read", "locomotive.read"],
  "locomotive.delete": ["company.read", "locomotive.read"],

  "location.read": ["company.read"],
  "location.create": ["company.read"],
  "location.update": ["company.read", "location.read"],
  "location.delete": ["company.read", "location.read"],

  "wagon.read": ["company.read"],
  "wagon.create": ["company.read"],
  "wagon.update": ["company.read", "wagon.read"],
  "wagon.delete": ["company.read", "wagon.read"],

  "reason.read": ["company.read"],
  "reason.create": ["company.read"],
  "reason.update": ["company.read", "reason.read"],
  "reason.delete": ["company.read", "reason.read"],

  "configuration.read": ["company.read"],
  "configuration.update": ["company.read", "configuration.read"],

  "settings.profile": ["company.read"],
  "settings.company": ["company.read"],
  "settings.role": ["company.read"],
  "settings.holiday": ["company.read"],
  "settings.password": ["company.read"],
  "settings.operation-type": ["company.read"],
  "settings.cost-center": ["company.read"],

  "shift.read": [
    "company.read",
    "customer.read",
    "project.read",
    "bv-project.read",
    "product.read",
    "employee.read",
    "locomotive.read",
    "location.read",
    "staff.read",
  ],
  "shift.create": [
    "company.read",
    "customer.read",
    "project.read",
    "bv-project.read",
    "product.read",
    "employee.read",
    "locomotive.read",
    "location.read",
    "staff.read",
    "type-of-operation.read",
    "cost-center.read",
  ],
  "shift.update": [
    "company.read",
    "shift.read",
    "customer.read",
    "project.read",
    "bv-project.read",
    "product.read",
    "employee.read",
    "locomotive.read",
    "location.read",
    "staff.read",
    "type-of-operation.read",
    "cost-center.read",
  ],
  "shift.delete": ["company.read", "shift.read"],

  "usn-shift.read": [
    "company.read",
    "product-usn.read",
    "locomotive.read",
    "employee.read",
    "location.read",
    "wagon.read",
    "order.read",
  ],
  "usn-shift.create": [
    "company.read",
    "product-usn.read",
    "locomotive.read",
    "employee.read",
    "location.read",
    "wagon.read",
    "order.read",
  ],
  "usn-shift.update": [
    "company.read",
    "usn-shift.read",
    "product-usn.read",
    "locomotive.read",
    "employee.read",
    "location.read",
    "wagon.read",
    "order.read",
  ],
  "usn-shift.delete": ["company.read", "usn-shift.read"],

  "product-usn.read": ["company.read", "customer.read", "location.read"],
  "product-usn.create": ["company.read", "customer.read", "location.read"],
  "product-usn.update": [
    "company.read",
    "product-usn.read",
    "customer.read",
    "location.read",
  ],
  "product-usn.delete": ["company.read", "product-usn.read"],

  "timesheet.read": ["company.read", "shift.read", "employee.read"],
  "timesheet.create": ["company.read", "shift.read", "employee.read"],
  "timesheet.update": [
    "company.read",
    "timesheet.read",
    "shift.read",
    "employee.read",
  ],
  "timesheet.delete": ["company.read", "timesheet.read"],

  "handover-book.read": ["company.read", "shift.read"],
  "handover-book.create": ["company.read", "shift.read"],
  "handover-book.update": ["company.read", "handover-book.read", "shift.read"],
  "handover-book.delete": ["company.read", "handover-book.read"],

  "usn-handover-book.read": ["company.read", "usn-shift.read"],
  "usn-handover-book.create": ["company.read", "usn-shift.read"],
  "usn-handover-book.update": [
    "company.read",
    "usn-handover-book.read",
    "usn-shift.read",
  ],
  "usn-handover-book.delete": ["company.read", "usn-handover-book.read"],

  "quality-management.read": [
    "company.read",
    "shift.read",
    "usn-shift.read",
    "employee.read",
    "customer.read",
  ],
  "quality-management.create": [
    "company.read",
    "shift.read",
    "usn-shift.read",
    "employee.read",
    "customer.read",
  ],
  "quality-management.update": [
    "company.read",
    "quality-management.read",
    "shift.read",
    "usn-shift.read",
    "employee.read",
    "customer.read",
  ],
  "quality-management.delete": ["company.read", "quality-management.read"],

  "sample.read": ["company.read", "locomotive.read"],
  "sample.create": ["company.read", "locomotive.read"],
  "sample.update": ["company.read", "sample.read", "locomotive.read"],
  "sample.delete": ["company.read", "sample.read"],

  "sample-examine.read": ["company.read", "sample.read", "locomotive.read"],
  "sample-examine.create": ["company.read", "sample.read", "locomotive.read"],
  "sample-examine.update": [
    "company.read",
    "sample-examine.read",
    "sample.read",
    "locomotive.read",
  ],
  "sample-examine.delete": ["company.read", "sample-examine.read"],

  "order.read": ["company.read", "location.read"],
  "order.create": ["company.read", "location.read"],
  "order.update": ["company.read", "order.read", "location.read"],
  "order.delete": ["company.read", "order.read"],

  "wagon-list.read": ["company.read", "shift.read", "wagon.read"],
  "wagon-list.create": ["company.read", "shift.read", "wagon.read"],
  "wagon-list.update": [
    "company.read",
    "wagon-list.read",
    "shift.read",
    "wagon.read",
  ],
  "wagon-list.delete": ["company.read", "wagon-list.read"],

  "shift-toll-cost.read": ["company.read", "shift.read"],
  "shift-toll-cost.create": ["company.read", "shift.read"],
  "shift-toll-cost.update": [
    "company.read",
    "shift-toll-cost.read",
    "shift.read",
  ],
  "shift-toll-cost.delete": ["company.read", "shift-toll-cost.read"],

  "locomotive-action.read": ["company.read", "locomotive.read"],
  "locomotive-action.create": ["company.read", "locomotive.read"],
  "locomotive-action.update": [
    "company.read",
    "locomotive-action.read",
    "locomotive.read",
  ],
  "locomotive-action.delete": ["company.read", "locomotive-action.read"],

  "company-request-employee.read": ["company.read", "employee.read"],
  "company-request-employee.create": ["company.read", "employee.read"],
  "company-request-employee.update": [
    "company.read",
    "company-request-employee.read",
    "employee.read",
  ],
  "company-request-employee.delete": [
    "company.read",
    "company-request-employee.read",
  ],

  "employee-holiday-request.read": ["company.read", "employee.read"],
  "employee-holiday-request.create": ["company.read", "employee.read"],
  "employee-holiday-request.update": [
    "company.read",
    "employee-holiday-request.read",
    "employee.read",
  ],
  "employee-holiday-request.delete": [
    "company.read",
    "employee-holiday-request.read",
  ],
};

export function getPermissionDependencies(
  permissionName: string,
  visited: Set<string> = new Set()
): string[] {
  if (visited.has(permissionName)) {
    return [];
  }

  visited.add(permissionName);

  const directDependencies = PERMISSION_DEPENDENCIES[permissionName] || [];
  const allDependencies = new Set<string>(directDependencies);

  for (const dep of directDependencies) {
    const nestedDeps = getPermissionDependencies(dep, visited);
    nestedDeps.forEach((d) => allDependencies.add(d));
  }

  return Array.from(allDependencies);
}

export function getMultiplePermissionDependencies(
  permissionNames: string[]
): string[] {
  const allDependencies = new Set<string>();
  const visited = new Set<string>();

  for (const permissionName of permissionNames) {
    const deps = getPermissionDependencies(permissionName, visited);
    deps.forEach((d) => allDependencies.add(d));
  }

  return Array.from(allDependencies);
}

export function expandPermissionsWithDependencies(
  selectedPermissions: number[],
  allPermissions: Array<{ id?: number; name: string; originalName?: string }>
): number[] {
  const validPermissions = allPermissions.filter(
    (p): p is { id: number; name: string; originalName?: string } => !!p.id
  );

  const permissionMap = new Map<string, number>();
  validPermissions.forEach((p) => {
    const key = p.originalName || p.name;
    permissionMap.set(key, p.id);
  });

  const selectedNames = selectedPermissions
    .map((id) => {
      const perm = validPermissions.find((p) => p.id === id);
      if (!perm) return undefined;
      return perm.originalName || perm.name;
    })
    .filter((name): name is string => !!name);

  const allRequiredNames = getMultiplePermissionDependencies(selectedNames);

  const allRequiredIds = new Set<number>(selectedPermissions);
  allRequiredNames.forEach((name) => {
    const id = permissionMap.get(name);
    if (id) {
      allRequiredIds.add(id);
    }
  });

  return Array.from(allRequiredIds);
}

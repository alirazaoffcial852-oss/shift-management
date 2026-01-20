export const Roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Employee", value: "EMPLOYEE" },
  { label: "Supervisor", value: "SUPERVISOR" },
] as const;

export const COSTING_TERMS = [
  {
    label: "COUNT HOLIDAY SURCHARGES COST ONLY",
    value: "COUNT_HOLIDAY_SURCHARGES_COST_ONLY",
  },
  {
    label: "COUNT HIGHEST SURCHARGES COST ONLY",
    value: "COUNT_HIGHEST_SURCHARGES_COST_ONLY",
  },
  { label: "COUNT ALL SURCHARGES COST", value: "COUNT_ALL_SURCHARGES_COST" },
] as const;

export const GENDER = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
] as const;

export const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
] as const;

export const EXTENDED_STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Archived", value: "ARCHIVED" },
] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
} as const;

export const PAGINATION_LIMITS = [10, 20, 50, 100] as const;

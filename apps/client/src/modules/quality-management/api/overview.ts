"use client";

import QualityManagementService from "@/services/qualityManagement";
import {
  QualityManagementShift,
  UsnShift,
  QualityManagementFilters,
} from "@/types/qualityManagement";

export type OverviewQuery = {
  search?: string;
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
  filters?: Record<string, string | number | boolean | null | undefined>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type OverviewRow = {
  id: string | number;
  date: string; // display-ready date or ISO
  customer: string;
  project: string;
  trainDriver: string;
  shantingAttendant: string;
  companyRating?: number; // 0..5
  employeeRating?: number; // 0..5
  customerRating?: number; // 0..5
  type: "shift" | "usn_shift"; // To differentiate between regular and USN shifts
  rawData?: any; // Store original data for actions
};

export type OverviewResponse = {
  rows: OverviewRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Helper function to extract personnel by role
 */
function getPersonnelByRole(roles: any[], roleShortName: string): string {
  if (!roles || roles.length === 0) return "-";

  const role = roles.find(
    (r) =>
      r.role?.short_name?.toLowerCase() === roleShortName.toLowerCase() ||
      r.role?.name?.toLowerCase().includes(roleShortName.toLowerCase())
  );

  if (!role) return "-";

  // Get personnel names (you might need to adjust this based on actual data structure)
  const personnels = role.shift_personnels || role.usn_shift_personnels || [];
  if (personnels.length === 0) return "-";

  // For now, just return count or IDs since we don't have user names
  return `Employee ${personnels[0]?.employee?.user_id || personnels[0]?.employee?.id || "N/A"}`;
}

/**
 * Transform shift data to table row format
 */
function transformShiftToRow(shift: QualityManagementShift): OverviewRow {
  return {
    id: shift.id,
    date: shift.date ? new Date(shift.date).toLocaleDateString() : "-",
    customer: shift.customer?.name || "-",
    project: shift.project?.name || "-",
    trainDriver: getPersonnelByRole(shift.shift_roles || [], "driver"),
    shantingAttendant: getPersonnelByRole(shift.shift_roles || [], "attendant"),
    companyRating: shift.company_rating || 0,
    employeeRating: shift.employee_rating || 0,
    customerRating: shift.customer_rating || 0,
    type: "shift",
    rawData: shift,
  };
}

/**
 * Transform USN shift data to table row format
 */
function transformUsnShiftToRow(shift: UsnShift): OverviewRow {
  return {
    id: `usn-${shift.id}`,
    date: shift.date ? new Date(shift.date).toLocaleDateString() : "-",
    customer: shift.product_usn?.customer?.name || "-",
    project: "USN Project", // USN shifts don't have traditional projects
    trainDriver: getPersonnelByRole(shift.usn_shift_roles || [], "driver"),
    shantingAttendant: getPersonnelByRole(
      shift.usn_shift_roles || [],
      "attendant"
    ),
    companyRating: shift.company_rating || 0,
    employeeRating: shift.employee_rating || 0,
    customerRating: shift.customer_rating || 0,
    type: "usn_shift",
    rawData: shift,
  };
}

export async function fetchQualityOverview(
  query: OverviewQuery
): Promise<OverviewResponse> {
  // Backend API not ready - return empty state without API calls
  // TODO: Enable API integration when backend is ready
  return {
    rows: [],
    pagination: {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
}

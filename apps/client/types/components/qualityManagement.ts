export type RatingFilterValue =
  | "all"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1"
  | "no-rating";

export type FeedbackFilterValue = "has-feedback" | "missing-feedback";

export interface FilterOption<T = string> {
  label: string;
  value: T;
}

export interface EmployeeFilterValue {
  id: number;
  name: string;
}

export interface OverviewRow {
  id: number;
  shiftId: number;
  date: string;
  employee: string;
  employeeId: number;
  customer: string;
  customerId: number;
  rating: number | null;
  hasFeedback: boolean;
  feedbackType: "EMPLOYEE" | "CUSTOMER" | "COMPANY";
}

export interface EmployeeFeedbackRow {
  id: number;
  shiftId: number;
  date: string;
  employee: string;
  employeeId: number;
  customer: string;
  customerId: number;
  hasFeedback: boolean;
}

export interface CustomerFeedbackRow {
  id: number;
  shiftId: number;
  date: string;
  employee: string;
  employeeId: number;
  customer: string;
  customerId: number;
  hasFeedback: boolean;
}

export interface CompanyFeedbackRow {
  id: number;
  shiftId: number;
  date: string;
  employee: string;
  employeeId: number;
  customer: string;
  customerId: number;
  rating: number | null;
  hasFeedback: boolean;
}

export interface QualityManagementFilters {
  rating?: RatingFilterValue;
  feedback?: FeedbackFilterValue;
  employee?: EmployeeFilterValue | null;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

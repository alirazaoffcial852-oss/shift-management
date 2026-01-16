"use client";

import JsonHttp from "@workspace/ui/lib/JsonHttp";

export type EmployeeFeedbackQuery = {
  search?: string;
  dateFrom?: string; // ISO
  dateTo?: string; // ISO
  filters?: Record<string, string | number | boolean | null | undefined>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type EmployeeFeedbackRow = {
  id: string | number;
  date: string;
  customer: string;
  project: string;
  trainDriver: string;
  shantingAttendant: string;
};

export type EmployeeFeedbackResponse = {
  rows: EmployeeFeedbackRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type Requester = (url: string, init?: RequestInit) => Promise<Response>;

export interface FetchEmployeeFeedbackOptions {
  baseUrl?: string;
  requester?: Requester;
}

const buildQueryString = (query: EmployeeFeedbackQuery): string => {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.dateFrom) params.set("dateFrom", query.dateFrom);
  if (query.dateTo) params.set("dateTo", query.dateTo);
  if (typeof query.page === "number") params.set("page", String(query.page));
  if (typeof query.limit === "number") params.set("limit", String(query.limit));
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortDir) params.set("sortDir", query.sortDir);
  if (query.filters) {
    Object.entries(query.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        params.set(`filters[${key}]`, String(value));
    });
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export async function fetchEmployeeFeedbacks(
  query: EmployeeFeedbackQuery,
  { baseUrl = "", requester = fetch }: FetchEmployeeFeedbackOptions = {}
): Promise<EmployeeFeedbackResponse> {
  const endpointPath = "/quality-management/employee-feedbacks";
  const url = `${baseUrl}${endpointPath}${buildQueryString(query)}`;
  const res = await requester(url, { method: "GET" });
  try {
    const data = (await res.json()) as EmployeeFeedbackResponse;
    if (!data || !Array.isArray(data.rows)) {
      throw new Error("Malformed response");
    }
    return data;
  } catch (err) {
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
}

export type CreateEmployeeFeedbackPayload = {
  employee_id: number;
  overall_rating?: string;
  expertise?: string;
  punctuality?: string;
  speed?: string;
  notes?: string;
};

export async function createEmployeeFeedback(
  payload: CreateEmployeeFeedbackPayload
): Promise<any> {
  try {
    const response = await JsonHttp.post("/employees/feedback", payload);
    return response;
  } catch (error: any) {
    const errorMessage =
      error?.data?.message || "Failed to create employee feedback";
    throw new Error(errorMessage);
  }
}

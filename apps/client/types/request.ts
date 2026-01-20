import { Pagination, PaginatedResponse } from "./pagination";
import { shiftRole } from "./shift";

export interface SendRequestErrors {
  company_id?: string;
  role_id?: string;
  sms_number?: string;
  note?: string;
}

export interface ReceiveRequestFormData {
  customer_id?: number;
  project_id?: number;
  bv_project_id?: number;
  product_id?: number;
  role_id?: number;
  shiftRole?: shiftRole[];
  employee_id?: string;
}

export interface ReceiveRequestErrors {
  customer_id: string;
  project_id: string;
  bv_project_id: string;
  product_id?: string;
  employee_id: string;
  role_id?: string;
}

export interface SendRequestFormData {
  requester_company_id: number | null;
  target_company_id: number | null;
  no_of_employee: string;
  note: string;
}

export interface SendRequestErrors {
  requester_company_id?: string;
  target_company_id?: string;
  no_of_employee?: string;
  note?: string;
}

export interface SendRequest {
  id: number;
  requester_company_id: number;
  target_company_id: number;
  no_of_employee: number;
  note: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SendRequestData {
  requester_company_id: number;
  target_company_id: number;
  no_of_employee: number;
  note: string;
}

export interface UpdateRequestData extends SendRequestData {
  id: number;
}

export interface ReceiveRequestData {
  id: number;
  requester_company_id: number;
  target_company_id: number;
  no_of_employee: number;
  note?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  created_at: string;
  updated_at: string;
  requester_company: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
  target_company: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface ReceiveRequestResponse extends PaginatedResponse<ReceiveRequestData> {}

export interface ReceiveRequestFilters {
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "";
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CompanyRequestEmployeeDetailPersonnel {
  employee_id: number;
}

export interface CompanyRequestEmployeeDetail {
  date: string;
  start_time: string;
  end_time: string;
}

export interface ApproveRequestData {
  customer_id: number;
  project_id: number;
  bv_project_id: number;
  product_id: number;
  role_id: number;
  company_request_employee_detail_personnels: CompanyRequestEmployeeDetailPersonnel[];
  company_request_employee_details: CompanyRequestEmployeeDetail[];
}

export interface Customer {
  id: number;
  company_id: number;
  name: string;
  phone: string;
  email: string;
  contact_person_name: string;
  contact_person_phone: string;
  address: string;
  country: string;
  city: string;
  postal_code: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  customer_id: number;
  company_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
}

export interface BvProject {
  id: number;
  project_id: number;
  company_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
}

export interface Product {
  id: number;
  company_id: number;
  customer_id: number;
  name: string;
  is_locomotive: boolean;
  has_toll_cost: boolean;
  toll_cost: string;
  toll_cost_type: "FLAT" | "PERCENTAGE";
  has_flat_price: boolean;
  flat_price: string;
  shift_flat_rate: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  created_at: string;
  updated_at: string;
  show_in_dropdown: boolean;
}

export interface Company {
  id: number;
  name: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  role_id: number;
  company_id: number;
  phone: string;
  date_of_birth: string;
  hiring_date: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  address: string;
  country: string;
  city: string;
  postal_code: string;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  short_name: string;
  act_as: "EMPLOYEE" | "ADMIN";
  has_train_driver: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShiftPersonnel {
  id: number;
  shift_role_id: number;
  employee_id: number;
  created_at: string;
  updated_at: string;
  employee: Employee;
}

export interface ShiftRole {
  id: number;
  shift_id: number;
  role_id: number;
  proximity: "NEARBY" | "FAR_AWAY";
  break_duration: string;
  start_day: "YES" | "NO";
  created_at: string;
  updated_at: string;
  shiftPersonnel: ShiftPersonnel[];
  role: Role;
}

export interface ShiftDetail {
  id: number;
  shift_id: number;
  location: string;
  type_of_operation_id: number;
  has_locomotive: boolean;
  has_contact_person: boolean;
  contact_person_name: string;
  contact_person_phone: string;
  has_note: boolean;
  note: string;
  has_document: boolean;
  cost_center_id: number;
  created_at: string;
  updated_at: string;
}

export interface ShiftTrain {
  id: number;
  shift_id: number;
  train_no: string;
  departure_location: string;
  arrival_location: string;
  freight_transport: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShiftDocument {
  id: number;
  shift_id: number;
  document: string;
  created_at: string;
  updated_at: string;
}

export interface TrackCostShift {
  id: number;
  customer_id: number;
  project_id: number;
  bv_project_id: number;
  product_id: number;
  dispatcher_id: number | null;
  company_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "FIXED" | "PENDING" | "INVOICED" | "APPROVED" | "BILLED";
  created_at: string;
  updated_at: string;
  customer: Customer;
  project: Project;
  bv_project: BvProject;
  product: Product;
  dispatcher: any;
  company: Company;
  shiftDetail: ShiftDetail[];
  shiftLocomotive: any[];
  shiftRole: ShiftRole[];
  shiftTrain: ShiftTrain[];
  shiftDocument: ShiftDocument[];
  timesheets: any[];
  shift_toll_cost: any[];
}

export interface TrackCostResponse {
  status: string;
  message: string;
  data: {
    data: TrackCostShift[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
}

export type TrackCostStatus =
  | "FIXED"
  | "PENDING"
  | "INVOICED"
  | "APPROVED"
  | "BILLED";

export interface TrackCostActionCallbacks {
  onStatusUpdate: (id: number, status: TrackCostStatus) => void;
}

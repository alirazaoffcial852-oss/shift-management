import { Pagination } from "./pagination";
import { BaseEntityRequired, EXTENDED_STATUS } from "./shared/global";

export type TrackCostStatus = "FIXED" | "PENDING" | "INVOICED" | "APPROVED" | "BILLED";

export type Proximity = "NEARBY" | "FAR_AWAY";

export type StartDay = "YES" | "NO";

export type ActAs = "EMPLOYEE" | "ADMIN";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type TollCostType = "FLAT" | "PERCENTAGE";

export interface TrackCostCustomer extends BaseEntityRequired {
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
  status: EXTENDED_STATUS;
}

export interface TrackCostProject extends BaseEntityRequired {
  customer_id: number;
  company_id: number;
  name: string;
  status: EXTENDED_STATUS;
}

export interface TrackCostBvProject extends BaseEntityRequired {
  project_id: number;
  company_id: number;
  name: string;
  status: EXTENDED_STATUS;
}

export interface TrackCostProduct extends BaseEntityRequired {
  company_id: number;
  customer_id: number;
  name: string;
  is_locomotive: boolean;
  has_toll_cost: boolean;
  toll_cost: string;
  toll_cost_type: TollCostType;
  has_flat_price: boolean;
  flat_price: string;
  shift_flat_rate: string;
  status: EXTENDED_STATUS;
  show_in_dropdown: boolean;
}

export interface TrackCostCompany extends BaseEntityRequired {
  name: string;
  status: EXTENDED_STATUS;
}

export interface TrackCostEmployee extends BaseEntityRequired {
  user_id: number;
  role_id: number;
  company_id: number;
  phone: string;
  date_of_birth: string;
  hiring_date: string;
  gender: Gender;
  address: string;
  country: string;
  city: string;
  postal_code: string;
  status: EXTENDED_STATUS;
}

export interface TrackCostRole extends BaseEntityRequired {
  name: string;
  short_name: string;
  act_as: ActAs;
  has_train_driver: boolean;
}

export interface TrackCostShiftPersonnel extends BaseEntityRequired {
  shift_role_id: number;
  employee_id: number;
  employee: TrackCostEmployee;
}

export interface TrackCostShiftRole extends BaseEntityRequired {
  shift_id: number;
  role_id: number;
  proximity: Proximity;
  break_duration: string;
  start_day: StartDay;
  shiftPersonnel: TrackCostShiftPersonnel[];
  role: TrackCostRole;
}

export interface TrackCostShiftDetail extends BaseEntityRequired {
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
}

export interface TrackCostShiftTrain extends BaseEntityRequired {
  shift_id: number;
  train_no: string;
  departure_location: string;
  arrival_location: string;
  freight_transport: boolean;
}

export interface TrackCostShiftDocument extends BaseEntityRequired {
  shift_id: number;
  document: string;
}

export interface TrackCostShift extends BaseEntityRequired {
  customer_id: number;
  project_id: number;
  bv_project_id: number;
  product_id: number;
  dispatcher_id: number | null;
  company_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: TrackCostStatus;
  customer: TrackCostCustomer;
  project: TrackCostProject;
  bv_project: TrackCostBvProject;
  product: TrackCostProduct;
  dispatcher: any;
  company: TrackCostCompany;
  shiftDetail: TrackCostShiftDetail[];
  shiftLocomotive: any[];
  shiftRole: TrackCostShiftRole[];
  shiftTrain: TrackCostShiftTrain[];
  shiftDocument: TrackCostShiftDocument[];
  timesheets: any[];
  shift_toll_cost: any[];
}

export interface TrackCostResponse {
  status: string;
  message: string;
  data: {
    data: TrackCostShift[];
    pagination: Pagination;
  };
}

export interface TrackCostActionCallbacks {
  onStatusUpdate: (id: number, status: TrackCostStatus) => void;
}

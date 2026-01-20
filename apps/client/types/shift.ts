import { Locomotive } from "@/types/locomotive";
import { BvProject } from "./bvProject";
import { Customer } from "./customer";
import { Employee } from "./employee";
import { Product } from "./product";
import { Project } from "./project";

import { Timesheet } from "./timeSheet";
import { ShiftDocument } from "@/components/Forms/shift/types/form";

export type HandoverBook = {
  id: number;
  shift_id?: number;
  usn_shift_id?: number;
  [key: string]: any;
};

export type PROXIMITY = "NEARBY" | "FAR_AWAY";

export type START_DAY = "NO" | "YES";

export type STATUS =
  | "DRAFT"
  | "OPEN"
  | "OFFER"
  | "PLANNED"
  | "FIXED"
  | "SUBMITTED"
  | "APPROVED"
  | "BILLED"
  | "REJECTED";

export type Shift = {
  id?: string;
  shiftDetail: shiftDetail;
  phone_no: string;
  customer?: Customer;
  customer_id: string;
  project?: Project;
  project_id: string;
  bv_project?: BvProject;
  bv_project_id: string;
  product?: Product;
  shiftDocument?: [];
  product_id: string;
  dispatcher_id: string;
  company_id: string;
  dispatcher?: {
    address: string;
    name: string;
  };
  locomotive?: Locomotive;
  status: STATUS;
  locomotive_id?: string;
  note?: string;
  shiftRole?: shiftRole[];
  shiftTrain?: ShiftTrain[];
  updated_shift_documents?: string;
  documents?: ShiftDocument[];
  shift_indexs?: string;
  start_time?: string;
  end_time?: string;
  date?: string;
  location: string;
  timesheets?: { [key: string]: Timesheet };
  timesheet_status?: string;
  handover_books?: HandoverBook | null;
};

export type shiftDetail = {
  contact_person_name?: string;
  contact_person_phone?: string;
  has_contact_person: boolean;
  has_document: boolean;
  has_locomotive: boolean;
  has_note: boolean;
  location: string;
  note: string;
  type_of_operation_id: string;
  cost_center_id: string;
  type_of_operation?: {
    id: string;
    name: string;
  };
};

export type ShiftTrain = {
  id?: number;
  train_no: string;
  departure_location: string;
  arrival_location: string;
  isEnabled?: boolean;
  freight_transport?: boolean;
};

export type shiftRole = {
  role_id: string;
  employee_id: string;
  proximity: PROXIMITY;
  has_submitted_timesheet?: boolean;
  employee?: Employee;
  break_duration: string;
  start_day: START_DAY;
  isDisabled?: boolean;
};

export type IniateShift = {
  start_date: string | null;
  end_date: string | null;
  start_time: string;
  end_time: string;
  roundsCount: 1;
  showRounds?: boolean;
};

export interface TrainDetail {
  train_no: string;
  departure_location: string;
  departure_time: string;
  arrival_location: string;
  arrival_time: string;
  notice_of_completion: string;
  remarks: string;
}

export interface WorkPerformance {
  from: string;
  to: string;
  work_performance: string;
}

export interface Change {
  from: string;
  to: string;
  changes: string;
  changer: string;
}

export interface Timesheet {
  id?: number;
  shift_id?: string;
  employee_id?: string;
  company_id?: string;
  start_time: string;
  end_time: string;
  break_duration: string;
  max_break_duration?: string;
  is_night_shift?: boolean;
  is_holiday?: boolean;
  has_extra_hours?: boolean;
  extra_hours?: number | null;
  extra_hours_note?: string;
  status?: TIMESHEET_STATUS;
  signature?: string;
  supervisor_signature?: string;
  submitted_at?: string;
  approved_at?: string;
  employee_ids?: string[];
  notes: string;
  isEnabled?: boolean;
  train_details?: TrainDetail[];
  work_performances?: WorkPerformance[];
  changes?: Change[];
  report_number?: string;
}

export interface TimesheetExtraHour {
  extra_hours: number;
  note: string;
}

export type TIMESHEET_STATUS = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface TimesheetFilters {
  employee_id?: number;
  status?: TIMESHEET_STATUS;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

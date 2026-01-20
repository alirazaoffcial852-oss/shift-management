import { Shift } from "../shift";
import { FORMMODE } from "../shared/global";

export interface TimesheetDocument {
  id: number;
  name: string;
  url: string;
  type?: string;
}

export interface WorkPerformance {
  id?: number;
  description: string;
  quantity?: number;
  unit?: string;
}

export interface TrainDetail {
  id?: number;
  train_number: string;
  departure_location: string;
  arrival_location: string;
  departure_time?: string;
  arrival_time?: string;
}

export interface Change {
  id?: number;
  description: string;
  change_type?: string;
}

export interface TimesheetFormData {
  shift_id: number;
  date: string;
  start_time: string;
  end_time: string;
  break_duration: number;
  work_performances: WorkPerformance[];
  train_details: TrainDetail[];
  changes: Change[];
  notes?: string;
  documents?: File[];
}

export interface TimesheetFormProps {
  mode: FORMMODE;
  timesheetId?: string;
  shiftId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface EditTimesheetFormProps {
  timesheetId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface BasicInformationFormProps {
  shift: Shift;
  formData: Partial<TimesheetFormData>;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export interface WorkPerformancesSectionProps {
  performances: WorkPerformance[];
  onChange: (index: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errors?: Record<string, string>;
}

export interface TrainDetailsSectionProps {
  details: TrainDetail[];
  onChange: (index: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errors?: Record<string, string>;
}

export interface ChangesSectionProps {
  changes: Change[];
  onChange: (index: number, field: string, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  errors?: Record<string, string>;
}

export interface TimesheetPDFProps {
  timesheet: any;
  t: (key: string) => string;
}

export interface ExtendedShift extends Shift {
  timesheet?: any;
}

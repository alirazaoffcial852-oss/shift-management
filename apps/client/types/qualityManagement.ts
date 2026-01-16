// Quality Management Types

export interface QualityManagementShift {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  customer?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
  };
  company?: {
    id: number;
    name: string;
  };
  // Ratings
  company_rating?: number;
  employee_rating?: number;
  customer_rating?: number;
  // Personnel
  shift_roles?: ShiftRole[];
}

export interface ShiftRole {
  id: number;
  role: {
    id: number;
    name: string;
    short_name: string;
  };
  shift_personnels?: ShiftPersonnel[];
}

export interface ShiftPersonnel {
  id: number;
  employee: {
    id: number;
    user_id: number;
    // User info would be nested here
  };
}

export interface UsnShift {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  company?: {
    id: number;
    name: string;
  };
  product_usn?: {
    id: number;
    customer: {
      id: number;
      name: string;
    };
  };
  // Ratings
  company_rating?: number;
  employee_rating?: number;
  customer_rating?: number;
  // Personnel
  usn_shift_roles?: UsnShiftRole[];
}

export interface UsnShiftRole {
  id: number;
  role: {
    id: number;
    name: string;
    short_name: string;
  };
  usn_shift_personnels?: UsnShiftPersonnel[];
}

export interface UsnShiftPersonnel {
  id: number;
  employee: {
    id: number;
    user_id: number;
  };
}

export interface ClientRole {
  id: number;
  name: string;
  short_name: string;
  act_as: string;
  has_train_driver: boolean;
}

export interface QualityManagementFilters {
  employee_id?: number;
  role_id?: number;
  customer_id?: number;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

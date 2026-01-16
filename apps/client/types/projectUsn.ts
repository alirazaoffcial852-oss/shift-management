export interface RoutePlanningRow {
  selectSecondWagon: any;
  arrivalLocation: string;
  id: string;
  startLocation: string;
  selectWagon: string[];
  selectPurpose: string;
  orders: string[];
  currentShiftProject: string[];
  countingLocation: string;
  endingLocation: string;
  train_no?: string;
  pickup_date?: string;
  starting_location_document?: Blob;
  ending_location_document?: Blob;
}

export interface ProjectUSNShiftRole {
  role_id: string;
  employee_id: string;
  proximity: "NEARBY" | "FAR_AWAY";
  break_duration: string;
  start_day: "NO" | "YES";
  isDisabled?: boolean;
}

export interface ProjectUSNFormData {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  productId: string;
  warehouseLocation?: string;
  routePlanningEnabled: boolean;
  routePlanning: RoutePlanningRow[];
  showDetails: boolean;
  shiftRole: ProjectUSNShiftRole[];
  documents: File[];
  locomotiveId?: string;
  hasNote: boolean;
  note?: string;
}

export interface RoutePlanningRowErrors {
  startLocation?: string;
  arrivalLocation?: string;
  train_no?: string;
  orders?: string;
}

export interface ProjectUSNFormErrors {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  productId?: string;
  warehouseLocation?: string;
  routePlanning?: string;
  routePlanningErrors?: Record<string, RoutePlanningRowErrors>;
  shiftRole?: string;
  documents?: string;
  locomotiveId?: string;
  note?: string;
}

export interface LocomotiveOption {
  value: string;
  label: string;
  id: number;
  name: string;
}

export interface EmployeeOption {
  value: string;
  label: string;
  id: number;
  name: string;
  role?: string;
}

export interface WagonOption {
  value: string;
  label: string;
  id: number;
  name: string;
  wagonNo: string;
  status: string;
  nextStatus: string;
  currentLocation: string;
  loadedEmptyLocation: string;
  typeOfWagon: string;
  maxCapacity: string;
  rail: string;
  position: string;
}

export interface PurposeOption {
  value: string;
  label: string;
}

export interface DestinationOption {
  value: string;
  label: string;
}

export interface ProjectOption {
  value: string;
  label: string;
  id: number;
  name: string;
}

export interface WagonFilters {
  location: string;
  status: string;
  wagonType: string;
  loadedLocation: string;
  rail: string;
  nextStatus: string;
  date: string;
}

export const BREAK_INCLUDES_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const NEARBY_OPTIONS = [
  { value: "nearby", label: "Nearby" },
  { value: "far_away", label: "Far Away" },
];

export const PURPOSE_OPTIONS = [
  { value: "Storaging", label: "Storaging" },
  { value: "Supplying", label: "Supplying" },
  { value: "Pick_up", label: "Pick_up" },
  { value: "Loading", label: "Loading" },
];

export const DESTINATION_OPTIONS = [
  { value: "ebersbach", label: "Ebersbach" },
  { value: "warehouse", label: "Warehouse" },
  { value: "station1", label: "Station 1" },
  { value: "station2", label: "Station 2" },
];

export const WAGON_STATUS_OPTIONS = [
  { value: "empty", label: "Empty" },
  { value: "planned_loaded", label: "Planned Loaded" },
  { value: "loaded", label: "Loaded" },
];

export const WAGON_TYPE_OPTIONS = [
  { value: "fac_s", label: "Fac (s)" },
  { value: "fas", label: "Fas" },
];

export const RAIL_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
];

export const LOCATION_OPTIONS = [
  { value: "warehouse", label: "Warehouse" },
  { value: "steinach", label: "Steinach" },
  { value: "fac_s", label: "Fac (s)" },
  { value: "fas", label: "Fas" },
];

export interface ProjectUSNShift {
  usn_shift_route_planning: boolean;
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  product_usn_id: number;
  company_id: number;
  has_locomotive: boolean;
  locomotive_id?: number;
  has_note: boolean;
  note?: string;
  has_document: boolean;
  has_route_planning: boolean;
  warehouse_location_id?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  product_usn?: {
    id: number;
    supplier_id?: number;
    customer_id?: number;
    supplier?: {
      id: number;
      name: string;
    };
    customer?: {
      id: number;
      name: string;
    };
  };
  company?: {
    id: number;
    name: string;
    status: string;
  };
  assistantShift?: {
    start_time?: string;
    end_time?: string;
  };
  locomotive?: {
    id: number;
    name: string;
  };
  usn_shift_roles?: Array<{
    usn_shift_personnels: any;
    id: number;
    usn_shift_id: number;
    role_id: number;
    proximity: "NEARBY" | "FAR_AWAY";
    break_duration: string;
    start_day: "NO" | "YES";
    role?: {
      id: number;
      name: string;
      short_name: string;
    };
  }>;
  usn_handover_book?: Record<string, any> | null;
}

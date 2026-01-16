export interface VdvChecksType {
  level3a: boolean;
  level3b: boolean;
}

export interface AvvChecksType {
  zp: boolean;
  wu: boolean;
  wsu: boolean;
}

export interface RestrictionsType {
  no: boolean;
  yes: boolean;
}

export interface WithType {
  locomotive: boolean;
  shuntingLocomotive: boolean;
  brakeTestingFacilities: boolean;
}

export interface AsPerVDV757Type {
  none: boolean;
  fullBreakingTest: boolean;
  simplifiedBreakingTest: boolean;
}

export interface TrainPreparationType {
  trainNumber?: number;
  location: string;
  railNumber: number;
  locomotive: string;
}

export interface FunctionType {
  AuditorLevel3: boolean;
  AuditorLevel4: boolean;
  Wagonmaster: boolean;
  Wagonauditor: boolean;
}

export interface TechnicalPreparationsType {
  date: string;
  fromTime: string;
  toTime: string;
  vdvChecks: VdvChecksType;
  avvChecks: AvvChecksType;
  restrictions: RestrictionsType;
}

export interface BrakePreparationType {
  brakeDate: string;
  brakeFromTime: string;
  brakeToTime: string;
  with: WithType;
  AsPerVDV757: AsPerVDV757Type;
  dangerousGoods: boolean;
  extraordinaryShipments: boolean;
  restrictions: RestrictionsType;
  function: FunctionType;
}

export interface WagonNumberItem {
  weightOfWagon: string | number | readonly string[] | undefined;
  wagonNumber: string;
  wagonType: string;
  lengthOverBuffer: string | number;
  loadedAxles: string | number;
  emptyAxles?: string | number;
  loadWeight: string | number;
  totalWeight: string | number;
  brakingWeightP: string;
  brakingWeightG: string;
  brakeSystemKLL: string;
  parkingBrake?: boolean;
  automaticBrake?: boolean;
  remark?: string;
}

export interface WagonNumberType {
  items: WagonNumberItem[];
  company: string;
  signature: string;
}

export interface WagonFormData {
  trainPreparation: TrainPreparationType;
  technicalPreparations: TechnicalPreparationsType;
  brakePreparation: BrakePreparationType;
  wagonNumbers: WagonNumberType;
  documents: [];
  deletedDocumentIds: number[];
}

export interface WagonListResponse extends WagonFormData {
  tech_prep_from_time: string;
  tech_prep_to_time: string;
  vdv_level_3a: boolean;
  vdv_level_3b: boolean;
  avv_zp: boolean;
  avv_wu: boolean;
  avv_wsu: boolean;
  tech_prep_restrictions_no: boolean;
  tech_prep_restrictions_yes: boolean;
  brake_date: string;
  brake_from_time: string;
  brake_to_time: string;
  with_locomotive: boolean;
  with_shunting_locomotive: boolean;
  with_brake_testing_facilities: boolean;
  vdv_757_none: boolean;
  vdv_757_full_breaking_test: boolean;
  vdv_757_simplified_breaking_test: boolean;
  dangerous_goods: boolean;
  extraordinary_shipments: boolean;
  brake_prep_restrictions_no: boolean;
  brake_prep_restrictions_yes: boolean;
  function_auditor_level_3: boolean;
  function_auditor_level_4: boolean;
  function_wagon_auditor: boolean;
  function_wagon_master: boolean;
  company: string;
  signature: string;
  wagonDocuments: any;
  tech_prep_date: string | null;
  train_number: number;
  rail_number: number;
  locomotive: string;
  location: string;
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  wagonItems: WagonItem[];
  shiftTrain?: ShiftTrain & {
    locomotive_name?: string;
    shift_date?: string;
  };
}

export interface FormErrors {
  trainNumber?: string;
  locomotive?: string;
  location?: string;
  railNumber?: string;
  date?: string;
  fromTime?: string;
  toTime?: string;
  brakeDate?: string;
  brakeFromTime?: string;
  brakeToTime?: string;
  general?: string;
  company?: string;
  signature?: string;
  [key: `wagonNumber-${number}`]: string | undefined;
  [key: `axles-${number}`]: string | undefined;
  [key: `lengthOverBuffer-${number}`]: string | undefined;
  [key: `loadedAxles-${number}`]: string | undefined;
  [key: `emptyAxles-${number}`]: string | undefined;
  [key: `loadWeight-${number}`]: string | undefined;
  [key: `totalWeight-${number}`]: string | undefined;
  [key: `brakingWeightP-${number}`]: string | undefined;
  [key: `brakingWeightG-${number}`]: string | undefined;
  [key: `brakeSystem-${number}`]: string | undefined;
  [key: `parkingBrake-${number}`]: string | undefined;
  [key: `automaticBrake-${number}`]: string | undefined;
  [key: `remark-${number}`]: string | undefined;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  role_id: number;
  image: string | null;
  role: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  employee: {
    id: number;
    phone: string;
    date_of_birth: string;
    hiring_date: string;
    gender: string;
    address: string;
    country: string;
    city: string;
    postal_code: string;
    status: string;
    company: {
      id: number;
      name: string;
      status: string;
      created_at: string;
      updated_at: string;
    };
  };
}

// types/wagonList.ts
export interface WagonItem {
  id: number;
  wagon_list_id: number;
  wagon_number: string;
  type_of_wagon: string;
  axles: number;
  length_over_buffer: number;
  empty_axles: number;
  loaded_axles: number;
  load_weight: number;
  total_weight: number;
  braking_weight_p: string;
  braking_weight_g: string;
  brake_system_h: boolean;
  brake_system_kll: string;
  parking_brake: boolean;
  has_automatic_brake: boolean;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface Shift {
  id: number;
  customer_id: number;
  project_id: number;
  bv_project_id: number;
  product_id: number;
  dispatcher_id: number;
  company_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  shiftDocument?: [];
  customer?: {
    id: number;
    name: string;
  };
  shiftRole?: Array<{
    employee_id?: number | string;
    employee?: {
      id?: number;
      name?: string;
      user?: {
        name?: string;
      };
    };
  }>;
}

export interface ShiftTrain {
  id: number;
  shift_id: number;
  train_no: string;
  departure_location: string;
  arrival_location: string;
  created_at: string;
  updated_at: string;
  shift: Shift;
}

export interface Wagon {
  id: number;
  shift_train_id: number;
  train_number: number;
  location: string;
  rail_number: number;
  tech_prep_date: string;
  tech_prep_from_time: string;
  tech_prep_to_time: string;
  vdv_level_3a: boolean;
  vdv_level_3b: boolean;
  avv_zp: boolean;
  avv_wu: boolean;
  avv_wsu: boolean;
  tech_prep_restrictions_no: boolean;
  tech_prep_restrictions_yes: boolean;
  brake_date: string;
  brake_from_time: string;
  brake_to_time: string;
  with_locomotive: boolean;
  with_shunting_locomotive: boolean;
  with_brake_testing_facilities: boolean;
  vdv_757_none: boolean;
  vdv_757_full_breaking_test: boolean;
  vdv_757_simplified_breaking_test: boolean;
  dangerous_goods: boolean;
  extraordinary_shipments: boolean;
  brake_prep_restrictions_no: boolean;
  brake_prep_restrictions_yes: boolean;
  function_auditor_level_3: boolean;
  function_auditor_level_4: boolean;
  function_wagon_auditor: boolean;
  function_wagon_master: boolean;
  company: string;
  signature: string;
  status: string;
  created_at: string;
  updated_at: string;
  wagonItems: WagonItem[];
  shiftTrain: ShiftTrain;
}

export interface WagonItem {
  id: number;
  wagon_list_id: number;
  wagon_number: string;
  type_of_wagon: string;
  axles: number;
  length_over_buffer: number;
  empty_axles: number;
  loaded_axles: number;
  load_weight: number;
  total_weight: number;
  braking_weight_p: string;
  braking_weight_g: string;
  brake_system_h: boolean;
  brake_system_kll: string;
  parking_brake: boolean;
  has_automatic_brake: boolean;
  remarks: string;
  created_at: string;
  updated_at: string;
}

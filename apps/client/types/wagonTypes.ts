import { Pagination } from "./pagination";
import { BaseEntityRequired, FormErrors, ApiSuccessResponse } from "./shared/global";

export interface WagonFormData {
  wagon_number: string;
  location_id?: number;
  rail: string;
  position: string;
  has_damage: boolean;
  wagon_type: string;
  maximun_capacity_of_load_weight: string;
  weight_of_the_wagon_itself: string;
  weight_of_load: string;
  braking_type: string;
  parking_brake: boolean;
  has_automatic_brake: boolean;
  length_over_buffer: string;
  loaded_axles: string;
  empty_axles: string;
  last_revision_date: string;
  next_revision_date: string;
  has_rent: boolean;
}

export interface WagonBrakeManualDetails {
  empty_braking_weight: string;
  full_braking_weight: string;
  conversion_weight: string;
}

export interface WagonBrakeAutoDetails {
  maximum_braking_weight: string;
}

export interface WagonDamageInformations {
  date_when_available_again: string;
  notes?: string;
}

export interface WagonRents {
  from: string;
  to: string;
  amount: string;
}

export interface WagonFormErrors extends FormErrors {}

export interface WagonLocation {
  id: number;
  name?: string;
  location?: string;
  type?: string;
}

export interface Wagon extends WagonFormData, BaseEntityRequired {
  status: string;
  location?: WagonLocation;
  wagon_brake_manual_details?: WagonBrakeManualDetails;
  wagon_brake_auto_details?: WagonBrakeAutoDetails;
  wagons_damage_informations?: WagonDamageInformations;
  wagon_rents?: WagonRents;
}

export interface WagonResponse extends ApiSuccessResponse<Wagon> {}

export interface WagonListResponse {
  data: Wagon[];
  message: string;
  pagination?: Pagination;
}

import { Company } from "./configuration";
import { RATE_TYPE } from "./rate";
import { Role } from "./role";
import { COSTING_TERMS, STATUS } from "./shared/global";
import { Route } from "./shared/route";

export type Product = {
  id?: number;
  name: string;
  status?: STATUS;
  customer_id: string;
  company_id: string;
  is_locomotive: boolean;
  has_toll_cost?: boolean;
  toll_cost?: number;
  toll_cost_type?: RATE_TYPE;
  has_flat_price?: boolean;
  flat_price?: number;
  shift_flat_rate?: number | null;
  show_in_dropdown?: boolean;
  routes?: Route[];
  productPersonnelPricings: ProductPersonnelPricing[];
};

export type ProductPersonnelPricing = {
  id?: number;
  product_id?: number;
  company_role_id?: number;
  company_personnel_id: number | undefined;
  far_away_hourly_rate: number;
  nearby_hourly_rate: number;
  flat_price?: number;
  included_in_flat_price: boolean;
  costing_terms: COSTING_TERMS;
  product?: Product;
  personnel?: CompanyRole;
  personnelNightShiftPricing?: PersonnelNightShiftPricing;
  personnelTravellingPricing?: PersonnelTravellingPricing;
  personnelHolidayPricing?: PersonnelHolidayPricing;
};

export type CompanyRole = {
  id: number;
  company_id: number;
  role_id: number;
  created_at: Date;
  updated_at: Date;
  company: Company;
  role: Role;
  productPersonnelPricings: ProductPersonnelPricing[];
};

export type PersonnelNightShiftPricing = {
  id?: number;
  personnel_pricing_id?: number;
  night_time_rate: number;
  night_time_rate_type: RATE_TYPE;
  night_shift_start_at: string;
  night_shift_end_at: string;
  personnelPricing?: ProductPersonnelPricing;
};

export type PersonnelTravellingPricing = {
  id?: number;
  personnel_pricing_id?: number;
  travel_time_rate: number;
  travel_time_rate_type: RATE_TYPE;
  travel_allowance_departure: number;
  travel_allowance_departure_type: RATE_TYPE;
  travel_allowance_arrival: number;
  travel_allowance_arrival_type: RATE_TYPE;
  full_day_travel_allowance: number;
  full_day_travel_allowance_type: RATE_TYPE;
  personnelPricing?: ProductPersonnelPricing;
};

export type PersonnelHolidayPricing = {
  id?: number;
  personnel_pricing_id?: number;
  holiday_rate: number;
  holiday_rate_type: RATE_TYPE;
  sunday_rate: number;
  sunday_rate_type: RATE_TYPE;
  personnelPricing?: ProductPersonnelPricing;
};

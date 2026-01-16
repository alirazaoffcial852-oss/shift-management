import { RATE_TYPE } from "@/types/rate";
import { User } from "@workspace/ui/types/user";
import { GENDER } from "@/types/shared/gender";
import { COSTING_TERMS, STATUS } from "./shared/global";
import { Role, RoleFormData } from "./role";
import { Location } from "@workspace/ui/types/country";

export type Employee = {
  [x: string]: any;
  id?: number;
  user: User;
  email?: string;
  name?: string;
  phone: string;
  date_of_birth: string;
  hiring_date: string;
  gender: GENDER;
  address: string;
  country: number | null;
  city: number | null;
  postal_code: string;
  role_id: string;
  company_id: string;
  location?: Location;
  pricing: Pricing;
  status?: STATUS;
};

export interface Pricing {
  far_away_hourly_rate: number | null;
  nearby_hourly_rate: number | null;
  costing_terms: COSTING_TERMS;
  monthly_hours_target_enabled?: boolean;
  monthly_hours_target?: number | null;
  nightShiftPricing: {
    night_time_rate: number | null;
    night_time_rate_type: RATE_TYPE;
    night_shift_start_at: string;
    night_shift_end_at: string;
  };
  travellingPricing: {
    travel_time_rate: number | null;
    travel_time_rate_type: RATE_TYPE;
    travel_allowance_departure: number | null;
    travel_allowance_departure_type: RATE_TYPE;
    travel_allowance_arrival: number | null;
    travel_allowance_arrival_type: RATE_TYPE;
    full_day_travel_allowance: number | null;
    full_day_travel_allowance_type: RATE_TYPE;
  };
  holidayPricing: {
    holiday_rate: number | null;
    holiday_rate_type: RATE_TYPE;
    sunday_rate: number | null;
    sunday_rate_type: RATE_TYPE;
  };
}

export interface StepRendererProps {
  currentStep: number;
  employees: Employee;
  setEmployees: React.Dispatch<React.SetStateAction<Employee>>;
  company: any;
  errors: Record<string, string>;
  handleContinue: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  loading: boolean;
  isEditMode?: boolean;
  onclose?: () => void;
  isDialog?: boolean;
}

export interface CurrentStep {
  currentStep: number;
}

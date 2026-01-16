import { Employee } from "@/types/employee";
import { GENDER as gender } from "@/types/shared/gender";
import { COSTING_TERMS } from "@/types/shared/global";

import { useTranslations } from "next-intl";

export const useSteps = () => {
  const t = useTranslations("steps.employees");

  return [{ title: t("personal_information") }, { title: t("pricing") }];
};

export const initialEmployee: Employee = {
  user: {
    name: "",
    email: "",
  },
  name: "",
  role_id: "",
  phone: "",
  date_of_birth: "",
  hiring_date: "",
  gender: "MALE" as unknown as gender,
  address: "",
  country: null,
  city: null,
  postal_code: "",
  company_id: "",
  pricing: {
    far_away_hourly_rate: null,
    nearby_hourly_rate: null,
    costing_terms:
      "COUNT_HOLIDAY_SURCHARGES_COST_ONLY" as unknown as COSTING_TERMS,
    monthly_hours_target_enabled: false,
    monthly_hours_target: null,
    nightShiftPricing: {
      night_time_rate: null,
      night_time_rate_type: "FLAT",
      night_shift_start_at: "",
      night_shift_end_at: "",
    },
    travellingPricing: {
      travel_time_rate: null,
      travel_time_rate_type: "FLAT",
      travel_allowance_departure: null,
      travel_allowance_departure_type: "FLAT",
      travel_allowance_arrival: null,
      travel_allowance_arrival_type: "FLAT",
      full_day_travel_allowance: null,
      full_day_travel_allowance_type: "FLAT",
    },
    holidayPricing: {
      holiday_rate: null,
      holiday_rate_type: "FLAT",
      sunday_rate: null,
      sunday_rate_type: "FLAT",
    },
  },
};

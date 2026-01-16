import { Employee, Pricing } from "@/types/employee";

export const validateEmployee = (employee: Employee) => {
  const newErrors: { [key: string]: string } = {};

  if (!employee.user.name) {
    newErrors.name = "Employee name is required";
  }
  if (!employee.role_id) {
    newErrors.role_id = "Role is required";
  }

  if (!employee.user.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(employee.user.email)) {
    newErrors.email = "Invalid email format";
  }
  if (!employee.phone) {
    newErrors.phone = "Phone number is required";
  }
  if (!employee.date_of_birth) {
    newErrors.date_of_birth = "Date of birth is required";
  } else {
    const birthDate = new Date(employee.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      newErrors.date_of_birth = "Employee must be at least 18 years old";
    }
  }
  if (!employee.hiring_date) {
    newErrors.hiring_date = "Hiring date is required";
  }
  if (!employee.gender) {
    newErrors.gender = "Gender is required";
  }
  if (!employee.address || employee.address.trim() === "") {
    newErrors.address = "Address is required";
  }
  if (!employee.country || employee.country === null || employee.country === 0) {
    newErrors.country = "Country is required";
  }
  if (!employee.city || employee.city === null || employee.city === 0) {
    newErrors.city = "City is required";
  }
  if (!employee.postal_code || employee.postal_code.trim() === "") {
    newErrors.postal_code = "Postal code is required";
  }

  return newErrors;
};

export const validatePricing = (pricing: Pricing) => {
  const newErrors: { [key: string]: string } = {};
  if (!pricing.costing_terms) {
    newErrors.costing_terms = "Costing terms is required";
  }
  if (pricing.far_away_hourly_rate === null) {
    newErrors.far_away_hourly_rate = "Far away hourly rate is required";
  }
  if (pricing.nearby_hourly_rate === null) {
    newErrors.nearby_hourly_rate = "Nearby hourly rate is required";
  }
  if (
    pricing.monthly_hours_target_enabled &&
    pricing.monthly_hours_target === null
  ) {
    newErrors.monthly_hours_target = "Monthly hours target is required ";
  }
  const nightShiftPricing = pricing.nightShiftPricing;
  if (nightShiftPricing.night_time_rate === null) {
    newErrors.night_time_rate = "Night time rate is required";
  }
  if (!nightShiftPricing.night_time_rate_type) {
    newErrors.night_time_rate_type = "Night time rate type is required";
  }
  if (!nightShiftPricing.night_shift_start_at) {
    newErrors.night_shift_start_at = "Night shift start time is required";
  }
  if (!nightShiftPricing.night_shift_end_at) {
    newErrors.night_shift_end_at = "Night shift end time is required";
  }

  const travellingPricing = pricing.travellingPricing;
  if (travellingPricing.travel_time_rate === null) {
    newErrors.travel_time_rate = "Travel time rate is required";
  }
  if (!travellingPricing.travel_time_rate_type) {
    newErrors.travel_time_rate_type = "Travel time rate type is required";
  }
  if (travellingPricing.travel_allowance_departure === null) {
    newErrors.travel_allowance_departure =
      "Travel allowance departure is required";
  }
  if (!travellingPricing.travel_allowance_departure_type) {
    newErrors.travel_allowance_departure_type =
      "Travel allowance departure type is required";
  }
  if (travellingPricing.travel_allowance_arrival === null) {
    newErrors.travel_allowance_arrival = "Travel allowance arrival is required";
  }
  if (!travellingPricing.travel_allowance_arrival_type) {
    newErrors.travel_allowance_arrival_type =
      "Travel allowance arrival type is required";
  }
  if (travellingPricing.full_day_travel_allowance === null) {
    newErrors.full_day_travel_allowance =
      "Full day travel allowance is required";
  }
  if (!travellingPricing.full_day_travel_allowance_type) {
    newErrors.full_day_travel_allowance_type =
      "Full day travel allowance type is required";
  }

  const holidayPricing = pricing.holidayPricing;
  if (holidayPricing.holiday_rate === null) {
    newErrors.holiday_rate = "Holiday rate is required";
  }
  if (!holidayPricing.holiday_rate_type) {
    newErrors.holiday_rate_type = "Holiday rate type is required";
  }
  if (holidayPricing.sunday_rate === null) {
    newErrors.sunday_rate = "Sunday rate is required";
  }
  if (!holidayPricing.sunday_rate_type) {
    newErrors.sunday_rate_type = "Sunday rate type is required";
  }

  return newErrors;
};

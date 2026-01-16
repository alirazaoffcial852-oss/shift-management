import { Product } from "@/types/product";

export const createFormData = (productData: Product, id: number): FormData => {
  const formData = new FormData();

  // Add basic product information
  formData.append("name", productData.name);
  formData.append("customer_id", productData.customer_id.toString());

  formData.append("company_id", id.toString());
  formData.append(
    "show_in_dropdown",
    productData.show_in_dropdown?.toString() || "false"
  );
  if (productData.is_locomotive) {
    formData.append("is_locomotive", productData.is_locomotive.toString());
  }

  // Add toll cost information if applicable
  if (productData.has_toll_cost) {
    formData.append("has_toll_cost", productData.has_toll_cost.toString());
    formData.append("toll_cost", productData.toll_cost?.toString() || "0");
  }

  // Add flat price information if applicable
  // Handle has_flat_price and flat_price
  if (productData.has_flat_price) {
    formData.append("has_flat_price", productData.has_flat_price.toString());
    formData.append("flat_price", productData.flat_price?.toString() || "0");
  }

  // Handle shift_flat_rate if present
  if (productData.shift_flat_rate) {
    formData.append("shift_flat_rate", productData.shift_flat_rate.toString());
  } else {
    formData.append("shift_flat_rate", "0");
  }

  // Add routes data as JSON
  if (
    productData.routes &&
    productData.routes.length > 0 &&
    productData.is_locomotive
  ) {
    formData.append("routes", JSON.stringify(productData.routes));
  } else {
    formData.append("routes", JSON.stringify([]));
  }

  // Add personnel data as JSON - handle optional fields properly
  if (
    productData.productPersonnelPricings &&
    productData.productPersonnelPricings.length > 0
  ) {
    // Create a sanitized version of personnel with all required fields
    const sanitizedPersonnel = productData.productPersonnelPricings.map(
      (person) => {
        const isIncludedInFlatPrice = person.included_in_flat_price === true;

        const sanitizedPerson: any = {
          // company_role_id: Number(person.company_personnel_id),
          company_personnel_id: Number(person.company_personnel_id),
          // Set all rate fields to 0 if included_in_flat_price is true
          far_away_hourly_rate: isIncludedInFlatPrice
            ? 0
            : person.far_away_hourly_rate,
          nearby_hourly_rate: isIncludedInFlatPrice
            ? 0
            : person.nearby_hourly_rate,
          costing_terms: person.costing_terms,
        };

        // Add optional fields only if they exist
        if (person.included_in_flat_price !== undefined) {
          sanitizedPerson.included_in_flat_price =
            person.included_in_flat_price;
        }

        // Handle night shift pricing
        if (person.personnelNightShiftPricing) {
          sanitizedPerson.personnelNightShiftPricing = {
            night_time_rate: isIncludedInFlatPrice
              ? 0
              : person.personnelNightShiftPricing.night_time_rate,
            night_time_rate_type:
              person.personnelNightShiftPricing.night_time_rate_type,
            night_shift_start_at:
              person.personnelNightShiftPricing.night_shift_start_at,
            night_shift_end_at:
              person.personnelNightShiftPricing.night_shift_end_at,
          };
        }

        // Handle travel pricing
        if (person.personnelTravellingPricing) {
          sanitizedPerson.personnelTravellingPricing = {
            travel_time_rate: isIncludedInFlatPrice
              ? 0
              : person.personnelTravellingPricing.travel_time_rate,
            travel_time_rate_type:
              person.personnelTravellingPricing.travel_time_rate_type,
            travel_allowance_departure: isIncludedInFlatPrice
              ? 0
              : person.personnelTravellingPricing.travel_allowance_departure,
            travel_allowance_departure_type:
              person.personnelTravellingPricing.travel_allowance_departure_type,
            travel_allowance_arrival: isIncludedInFlatPrice
              ? 0
              : person.personnelTravellingPricing.travel_allowance_arrival,
            travel_allowance_arrival_type:
              person.personnelTravellingPricing.travel_allowance_arrival_type,
            full_day_travel_allowance: isIncludedInFlatPrice
              ? 0
              : person.personnelTravellingPricing.full_day_travel_allowance,
            full_day_travel_allowance_type:
              person.personnelTravellingPricing.full_day_travel_allowance_type,
          };
        }

        // Handle holiday pricing
        if (person.personnelHolidayPricing) {
          sanitizedPerson.personnelHolidayPricing = {
            holiday_rate: isIncludedInFlatPrice
              ? 0
              : person.personnelHolidayPricing.holiday_rate,
            holiday_rate_type: person.personnelHolidayPricing.holiday_rate_type,
            sunday_rate: isIncludedInFlatPrice
              ? 0
              : person.personnelHolidayPricing.sunday_rate,
            sunday_rate_type: person.personnelHolidayPricing.sunday_rate_type,
          };
        }

        return sanitizedPerson;
      }
    );

    formData.append(
      "productPersonnelPricings",
      JSON.stringify(sanitizedPersonnel)
    );
  }

  return formData;
};

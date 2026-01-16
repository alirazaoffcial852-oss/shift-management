import { PersonnelTravellingPricing, Product } from "@/types/product";

export const validateProductForm = (
  product: Product,
  currentStep: number
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Step 1: Basic product info
  if (currentStep === 0) {
    if (!product.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!product.customer_id) {
      errors.customer_id = "Customer is required";
    }

    // If locomotive is true, routes are required
    if (product.is_locomotive) {
      if (!product.routes || product.routes.length === 0) {
        errors.routes = "At least  one  is required for locomotive products";
      }
    }
  }

  // Step 2: Route rates (only if is_locomotive)
  if (currentStep === 1 && product.is_locomotive) {
    if (!product.routes || product.routes.length === 0) {
      errors.routes = "At least one route is required";
    } else {
      product.routes.forEach((route, index) => {
        if (route.rate === undefined || route.rate <= 0) {
          errors[`routes[${index}].rate`] = "Rate value should be positive ";
        }
        if (!route.rate_type) {
          errors[`routes[${index}].rate_type`] =
            "Rate value should be positive";
        }
      });
    }
  }

  // Step 3: Toll costs
  if (currentStep === 2) {
    if (
      product.has_toll_cost &&
      (product.toll_cost === undefined || product.toll_cost <= 0)
    ) {
      errors.toll_cost = "Toll cost is required when toll cost is enabled";
    }
  }

  // Step 4: Personnel validation
  if (currentStep === 3) {
    if (
      !product.productPersonnelPricings ||
      product.productPersonnelPricings.length === 0
    ) {
      errors.productPersonnelPricings = "At least one personnel is required";
    } else {
      product.productPersonnelPricings.forEach((person, index) => {
        if (!person.company_personnel_id) {
          errors[`personnel[${index}].company_personnel_id`] =
            "Company personnel is required";
        }
      });
    }
  }

  // Step 5: Additional pricing and personnel details
  if (currentStep === 4) {
    if (
      product.has_flat_price &&
      (product.flat_price === undefined || product.flat_price <= 0)
    ) {
      errors.flat_price = "Flat price is required when flat price is enabled";
    }

    // Validate required fields for each personnel
    if (
      product.productPersonnelPricings &&
      product.productPersonnelPricings.length > 0
    ) {
      product.productPersonnelPricings.forEach((person, index) => {
        // Basic required fields
        if (
          person.far_away_hourly_rate === undefined ||
          (person.far_away_hourly_rate <= 0 && product.has_flat_price === false)
        ) {
          errors[`personnel[${index}].far_away_hourly_rate`] =
            "Far away hourly rate is required";
        }

        if (
          person.nearby_hourly_rate === undefined ||
          (person.nearby_hourly_rate <= 0 && product.has_flat_price === false)
        ) {
          errors[`personnel[${index}].nearby_hourly_rate`] =
            "Nearby hourly rate is required";
        }
        if (!person.costing_terms) {
          errors[`personnel[${index}].costing_terms`] =
            "Costing terms is required";
        }

        // Night shift pricing validation
        if (person.personnelNightShiftPricing) {
          if (
            person.personnelNightShiftPricing.night_time_rate === undefined ||
            (person.personnelNightShiftPricing.night_time_rate <= 0 &&
              product.has_flat_price === false)
          ) {
            errors[
              `personnel[${index}].personnelNightShiftPricing.night_time_rate`
            ] = "Night time rate is required";
          }

          // if (
          //   !person.personnelNightShiftPricing.night_time_rate_type &&
          //   product.has_flat_price === false
          // ) {
          //   errors[
          //     `personnel[${index}].personnelNightShiftPricing.night_time_rate_type`
          //   ] = "Night time rate type is required";
          // }

          // if (!person.personnelNightShiftPricing.night_shift_start_at) {
          //   errors[
          //     `personnel[${index}].personnelNightShiftPricing.night_shift_start_at`
          //   ] = "Night shift start time is required";
          // }

          // if (!person.personnelNightShiftPricing.night_shift_end_at) {
          //   errors[
          //     `personnel[${index}].personnelNightShiftPricing.night_shift_end_at`
          //   ] = "Night shift end time is required";
          // }
        }

        // Travel pricing validation
        if (person.personnelTravellingPricing) {
          if (
            person.personnelTravellingPricing.travel_time_rate === undefined ||
            (person.personnelTravellingPricing.travel_time_rate <= 0 &&
              product.has_flat_price === false)
          ) {
            errors[
              `personnel[${index}].personnelTravellingPricing.travel_time_rate`
            ] = "Travel time rate is required";
          }

          if (
            !person.personnelTravellingPricing.travel_time_rate_type &&
            product.has_flat_price === false
          ) {
            errors[
              `personnel[${index}].personnelTravellingPricing.travel_time_rate_type`
            ] = "Travel time rate type is required";
          }

          // Other travel pricing required fields
          const travelFields = [
            "travel_allowance_departure",
            "travel_allowance_departure_type",
            "travel_allowance_arrival",
            "travel_allowance_arrival_type",
            "full_day_travel_allowance",
            "full_day_travel_allowance_type",
          ];

          travelFields.forEach((field) => {
            if (
              (field.includes("_type") &&
                person.personnelTravellingPricing &&
                !person.personnelTravellingPricing[
                  field as keyof PersonnelTravellingPricing
                ] &&
                product.has_flat_price === false) ||
              (!field.includes("_type") &&
                person.personnelTravellingPricing &&
                (person.personnelTravellingPricing[
                  field as keyof PersonnelTravellingPricing
                ] === undefined ||
                  (person.personnelTravellingPricing[
                    field as keyof PersonnelTravellingPricing
                  ] as number) <= 0) &&
                product.has_flat_price === false)
            ) {
              errors[
                `personnel[${index}].personnelTravellingPricing.${field}`
              ] = `${field.replace(/_/g, " ")} is required`;
            }
          });
        }

        // Holiday pricing validation
        if (person.personnelHolidayPricing) {
          if (
            person.personnelHolidayPricing.holiday_rate === undefined ||
            (person.personnelHolidayPricing.holiday_rate <= 0 &&
              product.has_flat_price === false)
          ) {
            errors[`personnel[${index}].personnelHolidayPricing.holiday_rate`] =
              "Holiday rate is required";
          }

          if (
            !person.personnelHolidayPricing.holiday_rate_type &&
            product.has_flat_price === false
          ) {
            errors[
              `personnel[${index}].personnelHolidayPricing.holiday_rate_type`
            ] = "Holiday rate type is required";
          }

          if (
            person.personnelHolidayPricing.sunday_rate === undefined ||
            (person.personnelHolidayPricing.sunday_rate <= 0 &&
              product.has_flat_price === false)
          ) {
            errors[`personnel[${index}].personnelHolidayPricing.sunday_rate`] =
              "Sunday rate is required";
          }

          if (
            !person.personnelHolidayPricing.sunday_rate_type &&
            product.has_flat_price === false
          ) {
            errors[
              `personnel[${index}].personnelHolidayPricing.sunday_rate_type`
            ] = "Sunday rate type is required";
          }
        }
      });
    }
  }

  return errors;
};

// Helper function to check if form step is valid before continuing
export const isStepValid = (product: Product, currentStep: number): boolean => {
  const errors = validateProductForm(product, currentStep);
  return Object.keys(errors).length === 0;
};

import { FC } from "react";
import TypeSelection from "@workspace/ui/components/custom/TypeSelection";
import { PricingComponentProps } from "../components/types/form";
import { useTranslations } from "next-intl";

export const TravelSettings: FC<PricingComponentProps> = ({ employee, handlePricingChange, safeNumberToString, errors }) => {
  const trates = useTranslations("components.rate");
  return (
    <>
      <TypeSelection
        label={trates("travel_time_rate")}
        name="travel_time_rate"
        value={safeNumberToString(employee.pricing.travellingPricing.travel_time_rate)}
        onChange={(e) => handlePricingChange("travellingPricing", "travel_time_rate", e.target.value)}
        type={employee.pricing.travellingPricing.travel_time_rate_type}
        onTypeChange={(type) => handlePricingChange("travellingPricing", "travel_time_rate_type", type)}
        placeholder="Enter travel time rate"
        error={errors.travel_time_rate}
        required
      />
      <TypeSelection
        label={trates("travel_allowance_departure")}
        name="travel_allowance_departure"
        value={safeNumberToString(employee.pricing.travellingPricing.travel_allowance_departure)}
        onChange={(e) => handlePricingChange("travellingPricing", "travel_allowance_departure", e.target.value)}
        type={employee.pricing.travellingPricing.travel_allowance_departure_type}
        onTypeChange={(type) => handlePricingChange("travellingPricing", "travel_allowance_departure_type", type)}
        placeholder="Enter travel allowance departure"
        error={errors.travel_allowance_departure}
        required
      />
      <TypeSelection
        label={trates("travel_allowance_arrival")}
        name="travel_allowance_arrival"
        value={safeNumberToString(employee.pricing.travellingPricing.travel_allowance_arrival)}
        onChange={(e) => handlePricingChange("travellingPricing", "travel_allowance_arrival", e.target.value)}
        type={employee.pricing.travellingPricing.travel_allowance_arrival_type}
        onTypeChange={(type) => handlePricingChange("travellingPricing", "travel_allowance_arrival_type", type)}
        placeholder="Enter travel allowance arrival"
        error={errors.travel_allowance_arrival}
        required
      />
      <TypeSelection
        label={trates("full_day_travel_allowance")}
        name="full_day_travel_allowance"
        value={safeNumberToString(employee.pricing.travellingPricing.full_day_travel_allowance)}
        onChange={(e) => handlePricingChange("travellingPricing", "full_day_travel_allowance", e.target.value)}
        type={employee.pricing.travellingPricing.full_day_travel_allowance_type}
        onTypeChange={(type) => handlePricingChange("travellingPricing", "full_day_travel_allowance_type", type)}
        placeholder="Enter full day travel allowance"
        error={errors.full_day_travel_allowance}
        required
      />
    </>
  );
};

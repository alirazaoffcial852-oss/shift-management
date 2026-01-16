import { FC } from "react";
import TypeSelection from "@workspace/ui/components/custom/TypeSelection";
import { PricingComponentProps } from "../components/types/form";
import { useTranslations } from "next-intl";

export const HolidayRates: FC<PricingComponentProps> = ({
  employee,
  handlePricingChange,
  safeNumberToString,
  errors,
}) => {
  const trates = useTranslations("components.rate");
  return (
    <>
      <TypeSelection
        label={trates("holiday_rate")}
        name="holiday_rate"
        value={safeNumberToString(employee.pricing.holidayPricing.holiday_rate)}
        onChange={(e) =>
          handlePricingChange("holidayPricing", "holiday_rate", e.target.value)
        }
        type={employee.pricing.holidayPricing.holiday_rate_type}
        onTypeChange={(type) =>
          handlePricingChange("holidayPricing", "holiday_rate_type", type)
        }
        placeholder={trates("holiday_rate")}
        error={errors.holiday_rate}
        required
      />
      <TypeSelection
        label={trates("sunday_rate")}
        name="sunday_rate"
        value={safeNumberToString(employee.pricing.holidayPricing.sunday_rate)}
        onChange={(e) =>
          handlePricingChange("holidayPricing", "sunday_rate", e.target.value)
        }
        type={employee.pricing.holidayPricing.sunday_rate_type}
        onTypeChange={(type) =>
          handlePricingChange("holidayPricing", "sunday_rate_type", type)
        }
        placeholder={trates("sunday_rate")}
        error={errors.sunday_rate}
        required
      />
    </>
  );
};

import { FC } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { PricingComponentProps } from "../components/types/form";
import { useTranslations } from "next-intl";

export const HourlyRates: FC<PricingComponentProps> = ({
  employee,
  handlePricingChange,
  safeNumberToString,
  errors,
}) => {
  const trates = useTranslations("components.rate");
  return (
    <>
      <SMSInput
        label={trates("far_away_hourly_rate")}
        value={safeNumberToString(employee.pricing.far_away_hourly_rate)}
        onChange={(e) =>
          handlePricingChange("root", "far_away_hourly_rate", e.target.value)
        }
        type="number"
        error={errors.far_away_hourly_rate}
        required
      />
      <SMSInput
        label={trates("nearby_hourly_rate")}
        value={safeNumberToString(employee.pricing.nearby_hourly_rate)}
        onChange={(e) =>
          handlePricingChange("root", "nearby_hourly_rate", e.target.value)
        }
        type="number"
        error={errors.nearby_hourly_rate}
        required
      />
    </>
  );
};

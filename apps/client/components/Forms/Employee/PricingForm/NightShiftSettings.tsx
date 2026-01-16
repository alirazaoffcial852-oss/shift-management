import { FC } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import TypeSelection from "@workspace/ui/components/custom/TypeSelection";
import { PricingComponentProps } from "../components/types/form";
import { useTranslations } from "next-intl";

export const NightShiftSettings: FC<PricingComponentProps> = ({
  employee,
  handlePricingChange,
  safeNumberToString,
  errors,
}) => {
  const trates = useTranslations("components.rate");
  return (
    <>
      <TypeSelection
        label={trates("night_time_rate")}
        name="night_time_rate"
        value={safeNumberToString(
          employee?.pricing?.nightShiftPricing?.night_time_rate
        )}
        onChange={(e) =>
          handlePricingChange(
            "nightShiftPricing",
            "night_time_rate",
            e.target.value
          )
        }
        type={employee?.pricing?.nightShiftPricing?.night_time_rate_type}
        onTypeChange={(type) =>
          handlePricingChange("nightShiftPricing", "night_time_rate_type", type)
        }
        placeholder="Enter night time rate"
        error={errors?.night_time_rate}
        required
      />
      <SMSInput
        label={trates("night_shift_start_at")}
        type="time"
        value={
          employee?.pricing?.nightShiftPricing?.night_shift_start_at.toString() ||
          ""
        }
        onChange={(e) => {
          handlePricingChange(
            "nightShiftPricing",
            "night_shift_start_at",
            e.target.value
          );
        }}
        error={errors?.night_shift_start_at}
        required
      />
      <SMSInput
        label={trates("night_shift_end_at")}
        type="time"
        value={
          employee?.pricing?.nightShiftPricing?.night_shift_end_at.toString() ||
          ""
        }
        onChange={(e) => {
          handlePricingChange(
            "nightShiftPricing",
            "night_shift_end_at",
            e.target.value
          );
        }}
        error={errors.night_shift_end_at}
        required
      />
    </>
  );
};

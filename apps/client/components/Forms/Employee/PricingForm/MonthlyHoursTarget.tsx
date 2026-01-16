import { FC } from "react";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { PricingComponentProps } from "../components/types/form";
import { useTranslations } from "next-intl";

export const MonthlyHoursTarget: FC<PricingComponentProps> = ({
  employee,
  handlePricingChange,
  safeNumberToString,
  errors,
}) => {
  const trates = useTranslations("components.rate");
  return (
    <>
      <div className="flex items-center gap-6">
        <Label className="text-[20px] font-semibold">
          {trates("monthly_hours_target")}
        </Label>
        <Switch
          checked={employee?.pricing?.monthly_hours_target_enabled}
          onCheckedChange={(checked) => {
            handlePricingChange(
              "root",
              "monthly_hours_target_enabled",
              checked
            );
          }}
        />
      </div>
      {employee?.pricing.monthly_hours_target_enabled && (
        <SMSInput
          label={trates("monthly_hours_target")}
          value={safeNumberToString(employee?.pricing?.monthly_hours_target)}
          onChange={(e) =>
            handlePricingChange("root", "monthly_hours_target", e.target.value)
          }
          type="number"
          error={errors.monthly_hours_target}
          required
        />
      )}
    </>
  );
};

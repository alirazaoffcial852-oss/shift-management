import { FC } from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Pricing } from "@/types/employee";
import { MonthlyHoursTarget } from "./MonthlyHoursTarget";
import { CostingTerms } from "./CostingTerms";
import { HourlyRates } from "./HourlyRates";
import { NightShiftSettings } from "./NightShiftSettings";
import { TravelSettings } from "./TravelSettings";
import { HolidayRates } from "./HolidayRates";
import { PricingFormProps } from "../components/types/form";

export function PricingForm({ employee, onUpdate, errors, onSubmit, handleBack, isSubmitting, isDialog = false, onclose }: PricingFormProps) {
  const safeNumberToString = (value: number | undefined | null): string => {
    if (value === null) return "";
    if (!value) return "";
    return value.toString();
  };

  const handlePricingChange = (category: keyof Pricing | "root", field: string, value: string | boolean | number) => {
    const processedValue = typeof value === "string" && field !== "costing_terms" ? (value === "" ? null : value) : value;
    if (category === "root") {
      onUpdate({
        ...employee,
        pricing: {
          ...employee.pricing,
          [field]: processedValue,
        },
      });
    } else {
      onUpdate({
        ...employee,
        pricing: {
          ...employee.pricing,
          [category]: {
            ...(typeof employee.pricing[category] === "object" ? employee.pricing[category] : {}),
            [field]: processedValue,
          },
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyHoursTarget employee={employee} handlePricingChange={handlePricingChange} safeNumberToString={safeNumberToString} errors={errors} />
        <CostingTerms employee={employee} handlePricingChange={handlePricingChange} safeNumberToString={safeNumberToString} errors={errors} />
        <HourlyRates employee={employee} handlePricingChange={handlePricingChange} safeNumberToString={safeNumberToString} errors={errors} />
        <NightShiftSettings employee={employee} handlePricingChange={handlePricingChange} safeNumberToString={safeNumberToString} errors={errors} />
        <HolidayRates employee={employee} handlePricingChange={handlePricingChange} safeNumberToString={safeNumberToString} errors={errors} />
        <TravelSettings employee={employee} handlePricingChange={handlePricingChange} safeNumberToString={safeNumberToString} errors={errors} />
      </div>

      <div className="flex justify-between mt-8">
        {!isDialog ? (
          <SMSButton variant="outline" className="py-[14px] px-[24px] text-[16px] h-[54px] font-semibold" onClick={handleBack}>
            Back
          </SMSButton>
        ) : onclose ? (
          <SMSButton variant="outline" className="py-[14px] px-[24px] text-[16px] h-[54px] font-semibold" onClick={onclose}>
            Cancel
          </SMSButton>
        ) : null}
        <SMSButton className="py-[14px] px-[24px] text-[16px] h-[54px] font-semibold" onClick={onSubmit} loading={isSubmitting}>
          Submit
        </SMSButton>
      </div>
    </div>
  );
}

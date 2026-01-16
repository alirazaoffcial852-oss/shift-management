import { FC } from "react";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { COSTING_TERMS } from "@/constants/shared/globals";
import { PricingComponentProps } from "../components/types/form";
import { useTranslations } from "next-intl";

export const CostingTerms: FC<PricingComponentProps> = ({
  employee,
  handlePricingChange,
  errors,
}) => {
  const trates = useTranslations("components.rate");
  return (
    <div className="space-y-2">
      <Label className="font-medium text-gray-700 ml-1">
        {" "}
        {trates("costing_terms")}
      </Label>
      <Select
        value={employee.pricing.costing_terms.toString()}
        onValueChange={(value) =>
          handlePricingChange("root", "costing_terms", value)
        }
      >
        <SelectTrigger className="h-12 rounded-[16px]">
          <SelectValue placeholder="Select a Costing term" />
        </SelectTrigger>
        <SelectContent>
          {COSTING_TERMS.map((costing, i) => (
            <SelectItem key={i} value={costing.value}>
              {costing.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.costing_terms && (
        <p className="text-sm text-red-500">{errors.costing_terms}</p>
      )}
    </div>
  );
};

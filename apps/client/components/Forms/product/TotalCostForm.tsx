import { useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { Product } from "@/types/product";
import { TotalCostFormProps } from "./components/productForm";
import TypeSelection from "@workspace/ui/components/custom/TypeSelection";
import { RATE_TYPE } from "@/types/rate";
import { useTranslations } from "next-intl";

export function TotalCostForm({
  product,
  onUpdate,
  errors,
  onContinue,
  handleBack,
  isSubmitting = false,
}: TotalCostFormProps) {
  const tProduct = useTranslations("pages.products");
  const tactions = useTranslations("actions");

  const handleChange = (
    field: keyof Product,
    value: string | boolean | string[]
  ) => {
    onUpdate({
      ...product,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Label className="text-[18px] font-medium text-gray-700 ml-1">
          {tProduct("toll_cost")}
        </Label>
        <Switch
          checked={product.has_toll_cost}
          onCheckedChange={(checked) => handleChange("has_toll_cost", checked)}
        />
      </div>

      {product.has_toll_cost && (
        <div className="">
          <TypeSelection
            label={tProduct("toll_cost")}
            name={`toll_cost`}
            value={product.toll_cost || ""}
            onChange={(e) => handleChange("toll_cost", e.target.value)}
            placeholder={tProduct("toll_cost")}
            error={errors.toll_cost}
            type={product.toll_cost_type || "FLAT"}
            onTypeChange={(newType) =>
              handleChange("toll_cost_type", newType as RATE_TYPE)
            }
            required={true}
          />
        </div>
      )}

      <div className="flex justify-between mt-10 pl-2">
        <SMSButton
          className="bg-transparent shadow-none text-[18px] p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
          onClick={handleBack}
        >
          {tactions("back")}
        </SMSButton>
        <SMSButton className="bg-black rounded-full" onClick={onContinue}>
          {tactions("continue")}
        </SMSButton>
      </div>
    </div>
  );
}

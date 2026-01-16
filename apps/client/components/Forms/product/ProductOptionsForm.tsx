import React from "react";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";

interface ProductOptionsFormProps {
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  onContinue: () => void;
  errors: { [key: string]: string };
}

export const ProductOptionsForm: React.FC<ProductOptionsFormProps> = ({
  selectedOption,
  setSelectedOption,
  onContinue,
  errors,
}) => {
  return (
    <div className="space-y-4 md:space-y-6  md:p-6">
      <h2 className="text-xl font-semibold">Select Product Action</h2>
      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
        <div className="flex gap-4 flex-col">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="add" id="add" />
            <Label htmlFor="add">
              Add a new product based on this customization
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="edit" id="edit" />
            <Label htmlFor="edit">
              Update existing product with these customizations
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="customize" id="customize" />
            <Label htmlFor="customize">
              Customize this product for this shift only
            </Label>
          </div>
        </div>
      </RadioGroup>
      {errors.option && <p className="text-sm text-red-500">{errors.option}</p>}
      <div className="flex justify-end">
        <SMSButton
          className="w-full md:w-auto bg-black rounded-full px-4 md:px-8 py-2 md:py-3"
          onClick={onContinue}
        >
          Continue
        </SMSButton>
      </div>
    </div>
  );
};

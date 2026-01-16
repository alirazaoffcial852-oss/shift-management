import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { BasicInformationSectionProps } from "@/types/clientForm.interface";

export const BasicInformationSection: React.FC<
  BasicInformationSectionProps
> = ({ data, errors, isEditMode, handleInputChange }) => {
  return (
    <>
      <SMSInput
        label="Client Name"
        value={data.user.name}
        onChange={(e) => handleInputChange("user", "name", e.target.value)}
        required
        error={errors["user.name"]}
        name="name"
        placeholder="Enter client name"
      />

      <SMSInput
        label="Email"
        disabled={isEditMode}
        value={data.user.email}
        onChange={(e) => handleInputChange("user", "email", e.target.value)}
        required
        error={errors["user.email"]}
        name="email"
        type="email"
        placeholder="Enter email address"
      />
    </>
  );
};

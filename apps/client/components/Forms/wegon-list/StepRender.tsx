import React from "react";
import CombinedTrainPreparation from "./Forms/CombinedTrainPreparation";
import SignatureCanvas from "react-signature-canvas";
import { FormErrors, Profile, WagonFormData } from "@/types/wagon";
import WagonNumberForm from "./Forms/WagonNumberForm";

interface StepRendererProps {
  currentStep: number;
  formData: WagonFormData;
  errors: FormErrors;
  handleInputChange: (
    section: keyof WagonFormData,
    field: string,
    value: string
  ) => void;
  handleCheckboxChange: (
    section: keyof WagonFormData,
    field: string,
    subField?: string
  ) => void;
  handleRestrictionsChange: (
    section: "technicalPreparations" | "brakePreparation",
    value: "no" | "yes"
  ) => void;
  signatureRef: React.RefObject<SignatureCanvas>;
  isSignatureEmpty: boolean;
  setIsSignatureEmpty: (isEmpty: boolean) => void;
  preventBubbling: (e: React.MouseEvent) => void;
  profile: Profile | null;
  existingDocuments?: string[];
}

export const StepRenderer: React.FC<StepRendererProps> = ({
  currentStep,
  formData,
  errors,
  handleInputChange,
  handleCheckboxChange,
  handleRestrictionsChange,
  signatureRef,
  isSignatureEmpty,
  setIsSignatureEmpty,
  preventBubbling,
  profile,
  existingDocuments = [],
}) => {
  switch (currentStep) {
    case 0:
      return (
        <CombinedTrainPreparation
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
          handleRestrictionsChange={handleRestrictionsChange}
          signatureRef={signatureRef}
          isSignatureEmpty={isSignatureEmpty}
          setIsSignatureEmpty={setIsSignatureEmpty}
          preventBubbling={preventBubbling}
          profile={profile}
        />
      );
    case 1:
      return (
        <WagonNumberForm
          signatureRef={signatureRef}
          isSignatureEmpty={isSignatureEmpty}
          setIsSignatureEmpty={setIsSignatureEmpty}
          preventBubbling={preventBubbling}
          handleCheckboxChange={handleCheckboxChange}
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          existingDocuments={existingDocuments}
        />
      );
    default:
      return null;
  }
};

import React from "react";
import TrainPreparation from "./TrainPreparation";
import TechnicalPreparations from "./TechnicalPreparations";
import BrakePreparation from "./BrakePreparation";
import { FormErrors, WagonFormData, Profile } from "@/types/wagon";
import SignatureCanvas from "react-signature-canvas";

interface CombinedTrainPreparationProps {
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
  signatureRef?: React.RefObject<SignatureCanvas>;
  isSignatureEmpty?: boolean;
  setIsSignatureEmpty?: (isEmpty: boolean) => void;
  preventBubbling?: (e: React.MouseEvent) => void;
  profile?: Profile | null;
}

const CombinedTrainPreparation: React.FC<CombinedTrainPreparationProps> = ({
  formData,
  errors,
  handleInputChange,
  handleCheckboxChange,
  handleRestrictionsChange,
}) => {
  return (
    <div>
      <TrainPreparation
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />
      <TechnicalPreparations
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleRestrictionsChange={handleRestrictionsChange}
      />
      <BrakePreparation
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleRestrictionsChange={handleRestrictionsChange}
      />
    </div>
  );
};

export default CombinedTrainPreparation;


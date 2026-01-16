import { Sampling } from "@/types/Sampling";

export const validateSamplingField = (field: keyof Sampling, value: string): { isValid: boolean; error?: string } => {
  if (!value && (field === "locomotive_id" || field === "examination_frequency")) {
    const fieldLabels: Record<string, string> = {
      locomotive_id: "Locomotive",
      examination_frequency: "Examination frequency",
      start_date: "Start date",
    };

    return {
      isValid: false,
      error: `${fieldLabels[field] || field} is required`,
    };
  }

  return { isValid: true };
};

export const validateSamplingForm = (
  formData: Sampling
): {
  isValid: boolean;
  errors: { [key: string]: string };
} => {
  const errors: { [key: string]: string } = {};
  const requiredFields: (keyof Sampling)[] = ["locomotive_id", "examination_frequency", "start_date"];

  requiredFields.forEach((field) => {
    const validation = validateSamplingField(field, String(formData[field] || ""));
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

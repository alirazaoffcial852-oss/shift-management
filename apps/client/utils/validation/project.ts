// utils/validation.ts

import { Project } from "@/types/project";

export const validateProjectField = (
  field: keyof Project,
  value: string
): { isValid: boolean; error?: string } => {
  if (!value) {
    return {
      isValid: false,
      error: `${field === "customer_id" ? "Customer" : "Project name"} is required`,
    };
  }

  if (field === "name") {
    if (value.length < 3) {
      return {
        isValid: false,
        error: "Project name must be at least 3 characters long",
      };
    }
    if (value.length > 50) {
      return {
        isValid: false,
        error: "Project name must not exceed 50 characters",
      };
    }
  }

  return { isValid: true };
};

export const validateProjectForm = (
  formData: Project
): {
  isValid: boolean;
  errors: { [key: string]: string };
} => {
  const errors: { [key: string]: string } = {};
  const fields: (keyof Project)[] = ["name", "customer_id"];

  fields.forEach((field) => {
    const validation = validateProjectField(
      field,
      String(formData[field] || "")
    );
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

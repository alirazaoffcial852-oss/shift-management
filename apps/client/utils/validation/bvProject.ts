// utils/validation.ts

import { BvProject } from "@/types/bvProject";

export const validateBvProjectField = (
  field: keyof BvProject,
  value: string
): { isValid: boolean; error?: string } => {
  if (!value) {
    return {
      isValid: false,
      error: `${field === "project_id" ? "Project" : "BvProject name"} is required`,
    };
  }

  if (field === "name") {
    if (value.length < 3) {
      return {
        isValid: false,
        error: "BvProject name must be at least 3 characters long",
      };
    }
    if (value.length > 50) {
      return {
        isValid: false,
        error: "BvProject name must not exceed 50 characters",
      };
    }
  }

  return { isValid: true };
};

export const validateBvProjectForm = (
  formData: BvProject
): {
  isValid: boolean;
  errors: { [key: string]: string };
} => {
  const errors: { [key: string]: string } = {};
  const fields: (keyof BvProject)[] = ["name", "project_id"];

  fields.forEach((field) => {
    const validation = validateBvProjectField(
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

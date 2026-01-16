import { Customer } from "@/types/customer";

export const validateCustomerField = (
  field: keyof Customer,
  value: string
): { isValid: boolean; error?: string } => {
  if (value === "") {
    return {
      isValid: false,
      error: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")} is required`,
    };
  }

  switch (field) {
    case "phone":
    case "contact_person_phone":
      if (!/^\+?[\d\s-]{10,}$/.test(value)) {
        return {
          isValid: false,
          error: "Please enter a valid phone number",
        };
      }
      break;

    case "postal_code":
      if (!/^[A-Za-z0-9\s-]{3,10}$/.test(value)) {
        return {
          isValid: false,
          error: "Please enter a valid postal code",
        };
      }
      break;
  }

  return { isValid: true };
};

export const validateCustomerForm = (
  data: Customer
): {
  isValid: boolean;
  errors: { [key: string]: string };
} => {
  const errors: { [key: string]: string } = {};

  (Object.keys(data) as Array<keyof Customer>).forEach((field) => {
    const validation = validateCustomerField(field, String(data[field] || ""));
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

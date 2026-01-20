export interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
  message?: string;
}

export type ValidationRules<T> = Partial<Record<keyof T, ValidationRule>>;

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function validateField(
  value: any,
  rule: ValidationRule
): string | null {
  if (rule.required && isEmpty(value)) {
    return rule.message || "This field is required";
  }

  if (!isEmpty(value)) {
    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      return rule.message || "Invalid format";
    }

    if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} characters required`;
    }

    if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`;
    }

    if (rule.min !== undefined && typeof value === "number" && value < rule.min) {
      return rule.message || `Minimum value is ${rule.min}`;
    }

    if (rule.max !== undefined && typeof value === "number" && value > rule.max) {
      return rule.message || `Maximum value is ${rule.max}`;
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message || "Invalid value";
    }
  }

  return null;
}

export function validate<T extends object>(
  data: T,
  rules: ValidationRules<T>
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};

  (Object.keys(rules) as Array<keyof T>).forEach((key) => {
    const rule = rules[key];
    if (rule) {
      const error = validateField(data[key], rule);
      if (error) {
        errors[key] = error;
      }
    }
  });

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}

export function clearFieldError<T>(
  errors: ValidationErrors<T>,
  field: keyof T
): ValidationErrors<T> {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
}

export function setFieldError<T>(
  errors: ValidationErrors<T>,
  field: keyof T,
  message: string
): ValidationErrors<T> {
  return { ...errors, [field]: message };
}

function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  NUMERIC: /^[0-9]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
  POSTAL_CODE_DE: /^\d{5}$/,
} as const;

export function createRequiredRule(message?: string): ValidationRule {
  return { required: true, message };
}

export function createEmailRule(message?: string): ValidationRule {
  return {
    required: true,
    pattern: VALIDATION_PATTERNS.EMAIL,
    message: message || "Please enter a valid email address",
  };
}

export function createPhoneRule(message?: string): ValidationRule {
  return {
    required: true,
    pattern: VALIDATION_PATTERNS.PHONE,
    message: message || "Please enter a valid phone number",
  };
}

export function createMinLengthRule(minLength: number, message?: string): ValidationRule {
  return {
    minLength,
    message: message || `Minimum ${minLength} characters required`,
  };
}

export function createMaxLengthRule(maxLength: number, message?: string): ValidationRule {
  return {
    maxLength,
    message: message || `Maximum ${maxLength} characters allowed`,
  };
}

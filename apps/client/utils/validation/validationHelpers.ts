/**
 * Validation helper utilities that support translations
 */

type TranslationFunction = (
  key: string,
  values?: Record<string, any>
) => string;

/**
 * Get validation error message for a field
 * @param field - The field name
 * @param t - Optional translation function
 * @returns The validation error message
 */
export const getValidationMessage = (
  field: string,
  t?: TranslationFunction
): string => {
  if (t) {
    const translationKey = `common.validation.${field}_required`;
    const translated = t(translationKey);
    // If translation exists (not the same as key), use it
    if (translated !== translationKey) {
      return translated;
    }
    // Fallback to generic required message
    return t("common.validation.required", { field: formatFieldName(field) });
  }

  // Fallback to English if no translation function provided
  return formatFieldName(field) + " is required";
};

/**
 * Format field name for display (e.g., "contact_person_name" -> "Contact Person Name")
 */
const formatFieldName = (field: string): string => {
  return field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Get email validation message
 */
export const getEmailValidationMessage = (t?: TranslationFunction): string => {
  if (t) {
    return t("common.validation.email");
  }
  return "Please enter a valid email address";
};

/**
 * Create a validation rule with translation support
 */
export const createValidationRule = (
  field: string,
  options: {
    required?: boolean;
    pattern?: RegExp;
    message?: string;
    t?: TranslationFunction;
  }
): {
  message: string;
  required?: boolean;
  pattern?: RegExp;
} => {
  const { required, pattern, message, t } = options;

  let errorMessage = message;

  if (!errorMessage) {
    if (required) {
      errorMessage = getValidationMessage(field, t);
    } else if (pattern && field === "email") {
      errorMessage = getEmailValidationMessage(t);
    }
  }

  return {
    message: errorMessage || `${formatFieldName(field)} is required`,
    ...(required !== undefined && { required }),
    ...(pattern && { pattern }),
  };
};

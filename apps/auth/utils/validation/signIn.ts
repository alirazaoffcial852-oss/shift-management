export const validateField = (
  field: string,
  value: string,
  setErrors: Function
) => {
  if (!value) {
    setErrors((prev: any) => ({
      ...prev,
      [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
    }));
    return false;
  }
  return true;
};

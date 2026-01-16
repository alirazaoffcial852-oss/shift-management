export const resetPasswordValidation = (
  newPassword: string,
  confirmPassword: string
) => {
  const errors: { newPassword: string; confirmPassword: string } = {
    newPassword: "",
    confirmPassword: "",
  };
  if (!newPassword) {
    errors.newPassword = "New password is required";
  } else if (newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters long";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

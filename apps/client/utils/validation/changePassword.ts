export const resetPasswordValidation = (
  newPassword: string,
  confirmPassword: string,
  oldPassword: string
) => {
  const errors: {
    newPassword: string;
    confirmPassword: string;
    oldPassword: string;
  } = {
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  };
  if (!oldPassword) {
    errors.oldPassword = "Old password is required";
  }
  if (!newPassword) {
    errors.newPassword = "New password is required";
  } else if (newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters long";
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(newPassword)) {
    errors.newPassword =
      "New password must contain at least one uppercase letter, one lowercase letter, and one number";
  }
  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

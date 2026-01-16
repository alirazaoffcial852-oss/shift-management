export interface ChangePasswordFormFieldsProps {
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  setOldPassword: (value: string) => void;
  newPassword: string;
  oldPassword: string;
  confirmPassword: string;
  errors: { [key: string]: string };
}

export interface SignInFormFieldsProps {
  email: string;
  password: string;
  errors: { [key: string]: string };
  onFieldChange: (field: string, value: string) => void;
  onFieldBlur: (field: string, value: string) => void;
}

export interface ForgotPasswordFormFieldsProps {
  email: string;
  errors: { [key: string]: string };
  onFieldChange: (field: string, value: string) => void;
}

export interface ResetPasswordFormFieldsProps {
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  newPassword: string;
  confirmPassword: string;
  errors: { [key: string]: string };
}

import AuthService from "@/services/auth";
import { toast } from "sonner";

export const sendResetPasswordLinkToEmployee = async (
  email: string,
  onClose?: () => void
) => {
  try {
    const formData = new FormData();
    formData.append("email", email || "");

    let response = await AuthService.forgotPassword(formData);
    toast.success(response?.message);
    onClose?.();
  } catch (error) {
    toast.error((error as any)?.data?.message || "An error occurred");
    throw error;
  }
};

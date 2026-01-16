import { SuccessConfig } from "@/types/SuccessConfig";

export const SUCCESS_CONFIGS: Record<string, SuccessConfig> = {
  forgotPassword: {
    title: "Success!",
    message: "Password reset link sent to your email.",
  },
  resetPassword: {
    title: "Success!",
    message: "Password updated successfully.",
    showButton: true,
  },
};

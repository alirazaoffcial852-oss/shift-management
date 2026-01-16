"use client";
import { useState } from "react";
import AuthService from "@/services/auth";
import { resetPasswordValidation } from "@/utils/validation/changePassword";
import { toast } from "sonner";

export const useChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [errors, setErrors] = useState<{
    newPassword: string;
    confirmPassword: string;
    oldPassword: string;
  }>({
    newPassword: "",
    confirmPassword: "",
    oldPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent, token: string) => {
    e.preventDefault();
    setErrors({ newPassword: "", confirmPassword: "", oldPassword: "" });

    const validationErrors = resetPasswordValidation(
      newPassword,
      confirmPassword,
      oldPassword
    );

    if (validationErrors.newPassword || validationErrors.confirmPassword) {
      setErrors(validationErrors);
      return;
    } else {
      try {
        setLoading(true);

        const formData = new FormData();

        formData.append("currentPassword", oldPassword);
        formData.append("newPassword", newPassword);
        formData.append("confirmNewPassword", confirmPassword);

        let response = await AuthService.changePassword(formData);

        toast.success(response?.message);

        setLoading(false);
      } catch (error: any) {
        toast.error(error?.data?.message || "An error occurred");

        setLoading(false);
        setErrors({
          newPassword: "",
          confirmPassword: "",
          oldPassword: "",
        });
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 2000);
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    setOldPassword,
    oldPassword,
    errors,
    handleSubmit,
    isSubmitting,
    isSuccess,
    loading,
  };
};

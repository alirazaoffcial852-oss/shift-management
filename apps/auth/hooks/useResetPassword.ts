"use client";
import { resetPasswordValidation } from "@/utils/validation/resetPassword";
import { useState } from "react";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";

export const useResetPassword = () => {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    newPassword: string;
    confirmPassword: string;
  }>({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent, token: string) => {
    e.preventDefault();
    setErrors({ newPassword: "", confirmPassword: "" });

    const validationErrors = resetPasswordValidation(
      newPassword,
      confirmPassword
    );

    if (validationErrors.newPassword || validationErrors.confirmPassword) {
      setErrors(validationErrors);
      return;
    } else {
      try {
        setLoading(true);

        const formData = new FormData();

        formData.append("password", newPassword);

        await AuthService.resetPassword(formData, token);

        setLoading(false);

        router.push("/success?type=" + "resetPassword");
      } catch (error) {
        setLoading(false);
        setErrors({
          newPassword: "",
          confirmPassword: "",
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
    errors,
    handleSubmit,
    isSubmitting,
    isSuccess,
    loading,
  };
};

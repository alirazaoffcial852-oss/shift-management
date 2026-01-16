"use client";
import { useState } from "react";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useForgotPasswordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setEmail(() => value);

    if (field === "email" && !value.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Email is required" });

      return;
    }

    if (email.trim()) {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("email", email);

        await AuthService.forgotPassword(formData);
        setLoading(false);
        router.push("/success?type=" + "forgotPassword");
      } catch (error: any) {
        setLoading(false);

        let errorMessage = "An error occurred. Please try again.";
        if (error?.data?.message) {
          errorMessage = error.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        toast.error(errorMessage);
      }
    }
  };

  return {
    email,
    errors,
    handleInputChange,
    handleSubmit,
    loading,
  };
};

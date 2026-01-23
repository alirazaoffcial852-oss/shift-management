"use client";
import { login } from "@/lib/actions/auth";
import { decodeJwt } from "jose";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

interface ValidationErrors {
  [key: string]: string;
}

interface UseSigninFormProps {
  onSubmitSuccess?: () => void;
}

interface DecodedToken {
  role: {
    name: string;
  };
}

export const useSignInForm = ({ onSubmitSuccess }: UseSigninFormProps = {}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const validateField = (field: string, value: string): boolean => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
      }));
      return false;
    }

    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Please enter a valid email address",
      }));
      return false;
    }

    return true;
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (value) clearError(field);
  };

  const handleFieldBlur = (field: string, value: string) => {
    validateField(field, value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);

    if (isEmailValid && isPasswordValid) {
      setLoading(true);
      try {
        const response = await login(email, password);

        if (response.status === 200) {
          const token = response?.data?.data?.token;

          const decodedToken = decodeJwt(token) as DecodedToken;
          const roleName = decodedToken?.role?.name;
          
          const isAdmin = roleName === "ADMIN" || roleName === "ADMIN_STAFF";
          
          const baseRedirectUrl = isAdmin
            ? `${process.env.NEXT_PUBLIC_ADMIN_BASE_URL}/${locale}`
            : `${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/${locale}`;

          const redirectUrl = `${baseRedirectUrl}?token=${encodeURIComponent(token)}`;

          toast.success(response?.data?.message);
          onSubmitSuccess?.();
          
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 100);
        } else {
          const errorMessage = response?.data?.message || "Failed to sign in";
          setErrors({ submit: errorMessage });
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage =
          (error as any)?.response?.data?.message || "Failed to sign in";
        setErrors({ submit: errorMessage });
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    email,
    password,
    errors,
    loading,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
  };
};

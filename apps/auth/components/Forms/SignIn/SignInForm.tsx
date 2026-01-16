"use client";
import { cn } from "@workspace/ui/lib/utils";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useSignInForm } from "@/hooks/useSignInForm";
import { SignInFormFields } from "./SigninFormFields";
import { useTranslations } from "next-intl";

interface SignInFormProps {
  className?: string;
}

export function SignInForm({ className }: SignInFormProps) {
  const {
    email,
    password,
    errors,
    loading,
    handleFieldChange,
    handleFieldBlur,
    handleSubmit,
  } = useSignInForm({});

  const t = useTranslations("pages.auth");

  return (
    <form
      className={cn("flex flex-col gap-16", className)}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <h1>{t("loginToAccount")}</h1>
        <p className="text-[#2D2E3399]">{t("enterCredentials")}</p>
      </div>
      <SignInFormFields
        email={email}
        password={password}
        errors={errors}
        onFieldChange={handleFieldChange}
        onFieldBlur={handleFieldBlur}
      />
      <SMSButton
        loading={loading}
        type="submit"
        fullWidth
        text={t("login")}
        loadingText={t("loggingIn")}
        className="rounded-full"
      />
    </form>
  );
}

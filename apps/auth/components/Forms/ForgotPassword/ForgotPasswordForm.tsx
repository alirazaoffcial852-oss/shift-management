"use client";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useForgotPasswordForm } from "@/hooks/useForgetPassword";
import { ForgotPasswordFormFields } from "./ForgotPasswordFormFields";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function ForgotPasswordForm() {
  const { email, errors, handleSubmit, handleInputChange, loading } =
    useForgotPasswordForm();
  const t = useTranslations("pages.auth");
  const tCommon = useTranslations("common.buttons");

  const locale = useLocale();

  return (
    <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 mb-8">
        <h1>{t("forgotPassword")}</h1>
        <p className="text-[#2D2E3399]">{t("forgotPasswordDescription")}</p>
      </div>
      <ForgotPasswordFormFields
        email={email}
        errors={errors}
        onFieldChange={handleInputChange}
      />
      <SMSButton
        loading={loading}
        type="submit"
        fullWidth
        text={tCommon("getResetPasswordLink")}
        loadingText={tCommon("sendingLink")}
        className="rounded-full"
      />
      <div className="mt-3 text-center">
        <div className="inline-block text-base">
          <Link href={`/${locale}/sign-in`}>
            <span className="text-gray-600 hover:text-sms-primary transition-colors duration-300 ease-in-out">
              {t("backToSignIn")}
              <span className="ml-2 font-semibold hover:underline text-sms-primary hover:text-sms-primary-dark text-[#3E8258]">
                {t("signIn")}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </form>
  );
}

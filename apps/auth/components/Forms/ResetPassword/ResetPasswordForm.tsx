"use client";
import { useResetPassword } from "@/hooks/useResetPassword";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import React from "react";
import { ResetPasswordFormFields } from "./ResetPasswordFormFields";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const ResetPasswordForm: React.FC = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    handleSubmit,
    loading,
  } = useResetPassword();
  const params = useParams<{ token: string }>();
  const t = useTranslations("pages.auth");
  const tCommon = useTranslations("common.buttons");

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => handleSubmit(e, params.token)}
    >
      <div className="flex flex-col gap-2 mb-8">
        <h1>{t("resetPassword")}</h1>
        <p className="text-[#2D2E3399]">{t("enterNewPassword")}</p>
      </div>
      <ResetPasswordFormFields
        errors={errors}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
      <SMSButton
        loading={loading}
        type="submit"
        fullWidth
        text={tCommon("submit")}
        loadingText={t("updatingPassword")}
        className="rounded-full"
      />
    </form>
  );
};

export default ResetPasswordForm;

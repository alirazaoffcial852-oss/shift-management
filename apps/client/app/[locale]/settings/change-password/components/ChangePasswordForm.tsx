"use client";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import React from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useChangePassword } from "@/hooks/changePassword/useChangePassword";
import { ChangePasswordFormFields } from "./ChangePasswordFormFields";

const ChangePasswordForm: React.FC = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    oldPassword,
    setOldPassword,
    errors,
    handleSubmit,
    loading,
  } = useChangePassword();
  const params = useParams<{ token: string }>();
  const t = useTranslations("pages.auth");
  const labels = useTranslations("common.labels");

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(e) => handleSubmit(e, params.token)}
    >
      <ChangePasswordFormFields
        errors={errors}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
      <div className="flex justify-end">
        {" "}
        <SMSButton
          loading={loading}
          type="submit"
          fullWidth
          text={labels("changePassword")}
          loadingText={t("updatingPassword")}
          className="text-base text-white w-fit"
        />
      </div>
    </form>
  );
};

export default ChangePasswordForm;

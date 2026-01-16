import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { ResetPasswordFormFieldsProps } from "@/types/auth";
import { useTranslations } from "next-intl";

export function ResetPasswordFormFields({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
}: ResetPasswordFormFieldsProps) {
  const t = useTranslations("common.labels");

  return (
    <div className="grid gap-6">
      <div className="mb-4">
        <SMSInput
          label={t("newPassword")}
          type="password"
          placeholder={t("newPassword")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          error={errors.newPassword}
          name="password"
          className="w-full"
          showPasswordToggle
          isLoginPage
        />
      </div>
      <div className="mb-4">
        <SMSInput
          label={t("confirmPassword")}
          type="password"
          placeholder={t("confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={errors.confirmPassword}
          name="password"
          className="w-full"
          showPasswordToggle
          isLoginPage
        />
      </div>
    </div>
  );
}

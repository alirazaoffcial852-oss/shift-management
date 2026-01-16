import { ChangePasswordFormFieldsProps } from "@/types/auth";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { useTranslations } from "next-intl";

export function ChangePasswordFormFields({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  oldPassword,
  setOldPassword,
  errors,
}: ChangePasswordFormFieldsProps) {
  const t = useTranslations("common.labels");

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-xl font-bold">{t("changePassword")}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4">
        <div className="text-sm font-medium text-gray-700">
          {t("currentPassword")}
        </div>
        <div className="md:col-span-2">
          <SMSInput
            type="password"
            placeholder={t("currentPassword")}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            error={errors.oldPassword}
            name="password"
            showPasswordToggle
            isLoginPage
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4">
        <div className="text-sm font-medium text-gray-700">
          {t("newPassword")}
        </div>
        <div className="md:col-span-2">
          <SMSInput
            type="password"
            placeholder={t("newPassword")}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            error={errors.newPassword}
            name="password"
            showPasswordToggle
            isLoginPage
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pb-4">
        <div className="text-sm font-medium text-gray-700">
          {t("confirmPassword")}
        </div>
        <div className="md:col-span-2">
          <SMSInput
            type="password"
            placeholder={t("confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={errors.confirmPassword}
            name="password"
            showPasswordToggle
            isLoginPage
          />
        </div>
      </div>
    </div>
  );
}

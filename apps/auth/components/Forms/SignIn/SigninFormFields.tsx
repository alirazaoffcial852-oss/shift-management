import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import Link from "next/link";
import { SignInFormFieldsProps } from "@/types/auth";
import { useLocale, useTranslations } from "next-intl";

export function SignInFormFields({
  email,
  password,
  errors,
  onFieldChange,
  onFieldBlur,
}: SignInFormFieldsProps) {
  const t = useTranslations("common.labels");
  const tAuth = useTranslations("pages.auth");
  const locale = useLocale();

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <SMSInput
          name="email"
          type="email"
          required
          placeholder="m@example.com"
          label={t("email")}
          value={email}
          onChange={(e) => onFieldChange("email", e.target.value)}
          onBlur={(e) => onFieldBlur("email", e.target.value)}
          error={errors.email}
        />
      </div>
      <div className="grid gap-2">
        <SMSInput
          name="password"
          type="password"
          required
          placeholder={t("password")}
          label={t("password")}
          showPasswordToggle
          isLoginPage
          value={password}
          onChange={(e) => onFieldChange("password", e.target.value)}
          onBlur={(e) => onFieldBlur("password", e.target.value)}
          error={errors.password}
          forgotPasswordComponent={
            <Link
              href={`/${locale}/forgot-password`}
              className="text-sm hover:underline text-[#1F509C]"
            >
              {tAuth("forgotPassword")}
            </Link>
          }
        />
      </div>
      {errors.submit && (
        <div className="text-red-500 text-sm">{errors.submit}</div>
      )}
    </div>
  );
}

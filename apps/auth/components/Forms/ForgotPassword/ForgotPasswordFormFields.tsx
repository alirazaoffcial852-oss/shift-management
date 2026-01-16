import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { ForgotPasswordFormFieldsProps } from "@/types/auth";
import { useTranslations } from "next-intl";

export function ForgotPasswordFormFields({
  email,
  errors,
  onFieldChange,
}: ForgotPasswordFormFieldsProps) {
  const t = useTranslations("common.labels");

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
          error={errors.email}
        />
      </div>
      {errors.submit && (
        <div className="text-red-500 text-sm">{errors.submit}</div>
      )}
    </div>
  );
}

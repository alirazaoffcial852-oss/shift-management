import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSectionProps } from "@/types/clientForm.interface";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";

export const LanguageSection: React.FC<LanguageSectionProps> = ({
  data,
  errors,
  handleInputChange,
}) => {
  const { languages, loading } = useLanguage();

  return (
    <SMSCombobox
      options={languages.map((language) => ({
        label: language.name,
        value: language.id.toString(),
      }))}
      label="Default Language"
      value={data.language.id?.toString()}
      loading={loading}
      error={errors["language_id"]}
      placeholder="Select language"
      searchPlaceholder="Search language..."
      required
      onValueChange={(value) => handleInputChange("language", "id", value)}
    />
  );
};

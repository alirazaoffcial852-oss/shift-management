"use client";
import type React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";
import { FORMMODE } from "@/types/shared/global";
import { SendRequest } from "@/types/request";
import { useSendRequestForm } from "@/hooks/sendRequest/useSendRequestHook";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";

interface SendRequestFormProps {
  useComponentAs: FORMMODE;
  id?: number;
  onclose?: (request: SendRequest) => void;
  isDialog?: boolean;
}

const SendRequestForm: React.FC<SendRequestFormProps> = ({
  id,
  onclose,
  isDialog = false,
}) => {
  const {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    companies,
    loading,
    isLoadingCompanies,
    companiesPagination,
  } = useSendRequestForm(Number(id), onclose);

  const taction = useTranslations("actions");
  const t = useTranslations("common");
  const tcommon = useTranslations("common.labels");

  return (
    <div className={`${isDialog ? "flex flex-col h-full" : ""}`}>
      <form
        onSubmit={handleSubmit}
        className={`${isDialog ? "flex flex-col h-full" : "space-y-6"}`}
      >
        <div
          className={`${isDialog ? "flex-1 overflow-y-auto space-y-6 pr-2 pb-4" : "space-y-6"}`}
        >
          <div className="p-2 sm:p-4 mb-4">
            <div className="block md:hidden">
              <div className="space-y-4">
                <SMSCombobox
                  label={t("target_company")}
                  placeholder={t("select_target_company")}
                  searchPlaceholder={t("search_company")}
                  value={formData?.target_company_id?.toString() || ""}
                  onValueChange={(value) =>
                    handleInputChange("target_company_id", value)
                  }
                  options={companies.map((company: any) => ({
                    value: company.id?.toString(),
                    label: company.name,
                  }))}
                  required
                  error={errors?.target_company_id}
                  hasMore={
                    companiesPagination.page < companiesPagination.total_pages
                  }
                  loadingMore={isLoadingCompanies}
                  onLoadMore={() => {}}
                  onSearch={() => {}}
                />
                <SMSInput
                  label={t("number_of_employees")}
                  value={formData.no_of_employee}
                  onChange={(e) =>
                    handleInputChange("no_of_employee", e.target.value)
                  }
                  required
                  error={errors?.no_of_employee}
                  name="no_of_employee"
                  placeholder={t("enter_number_of_employees")}
                  type="number"
                />

                <div className="space-y-2">
                  <Label htmlFor="note">{t("note")}</Label>
                  <Textarea
                    id="note"
                    value={formData.note || ""}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    placeholder={t("add_note_optional")}
                  />
                  {errors?.note && (
                    <p className="text-sm text-red-500">{errors.note}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SMSCombobox
                  label={t("target_company")}
                  placeholder={t("select_target_company")}
                  searchPlaceholder={t("search_company")}
                  value={formData?.target_company_id?.toString() || ""}
                  onValueChange={(value) =>
                    handleInputChange("target_company_id", value)
                  }
                  options={companies.map((company: any) => ({
                    value: company.id?.toString(),
                    label: company.name,
                  }))}
                  required
                  error={errors?.target_company_id}
                  hasMore={
                    companiesPagination.page < companiesPagination.total_pages
                  }
                  loadingMore={isLoadingCompanies}
                  onLoadMore={() => {}}
                  onSearch={() => {}}
                />

                <SMSInput
                  label={t("number_of_employees")}
                  value={formData.no_of_employee}
                  onChange={(e) =>
                    handleInputChange("no_of_employee", e.target.value)
                  }
                  required
                  error={errors?.no_of_employee}
                  name="no_of_employee"
                  placeholder={t("enter_number_of_employees")}
                  type="number"
                />
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="note">{t("note")}</Label>
                <Textarea
                  id="note"
                  value={formData.note || ""}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  placeholder={t("add_note_optional")}
                />
                {errors?.note && (
                  <p className="text-sm text-red-500">{errors.note}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${isDialog ? "flex-shrink-0 sticky bottom-0 bg-white pt-4 pb-2 " : ""} flex justify-center ${isDialog ? "" : "!mt-[129px]"} px-2`}
        >
          <SMSButton
            className="bg-black rounded-full w-full sm:w-auto min-w-[120px]"
            type="submit"
            loading={loading}
            loadingText={id ? t("updating_request") : t("sending_request")}
            text={id ? t("buttons.update") : taction("send")}
          />
        </div>
      </form>
    </div>
  );
};

export default SendRequestForm;

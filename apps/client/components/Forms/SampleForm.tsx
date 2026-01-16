"use client";
import type React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";
import { FORMMODE } from "@/types/shared/global";
import { useSamplingForm } from "@/hooks/sampling/useSamplingForm";
import { PlusCircle, Trash2 } from "lucide-react";
import { Sampling } from "@/types/Sampling";

interface SampleFormProps {
  useComponentAs: FORMMODE;
  id?: number;
  onclose?: (sample: Sampling[] | Sampling) => void;
  isDialog?: boolean;
}

const SampleForm: React.FC<SampleFormProps> = ({
  useComponentAs,
  id,
  onclose,
  isDialog = false,
}) => {
  const {
    samples,
    errors,
    handleInputChange,
    handleSubmit,
    locomotives,
    loading,
    handleSearchLocomotives,
    handleLoadMoreLocomotives,
    isLoadingProjects,
    pagination,
    addSampleEntry,
    removeSampleEntry,
  } = useSamplingForm(Number(id), onclose);

  const tsidebar = useTranslations("components.sidebar");
  const t = useTranslations("common");

  return (
    <div className={`${isDialog ? "flex flex-col h-full" : ""}`}>
      <form
        onSubmit={handleSubmit}
        className={`${isDialog ? "flex flex-col h-full" : "space-y-6"}`}
      >
        <div
          className={`${isDialog ? "flex-1 overflow-y-auto space-y-6 pr-2 pb-4" : "space-y-6"}`}
        >
          {samples.map((sample, index) => (
            <div key={index} className="p-2 sm:p-4 mb-4">
              <div className="block md:hidden">
                {!id && (
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-lg">{index + 1}.</span>
                    <div className="flex items-center space-x-2">
                      {samples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSampleEntry(index)}
                          className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0 p-2"
                          aria-label={t("remove_sample")}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      {index === samples.length - 1 && (
                        <SMSButton
                          type="button"
                          onClick={addSampleEntry}
                          className="p-2"
                          aria-label={t("add_sample")}
                        >
                          <PlusCircle size={18} color="#3f8359" />
                        </SMSButton>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <SMSCombobox
                    label={`${tsidebar("locomotive")}`}
                    placeholder={`${tsidebar("locomotive")}`}
                    searchPlaceholder={t("search_locomotive")}
                    value={sample?.locomotive_id?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange(index, "locomotive_id", value)
                    }
                    options={locomotives.map((locomotive: any) => ({
                      value: locomotive.id?.toString(),
                      label: locomotive.name,
                    }))}
                    required
                    error={errors[index]?.locomotive_id}
                    hasMore={pagination.page < pagination.total_pages}
                    loadingMore={isLoadingProjects}
                    onLoadMore={handleLoadMoreLocomotives}
                    onSearch={handleSearchLocomotives}
                  />
                  <SMSInput
                    label={`${tsidebar("examination_frequency")}`}
                    value={sample.examination_frequency}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "examination_frequency",
                        e.target.value
                      )
                    }
                    required
                    error={errors[index]?.examination_frequency}
                    name="examination_frequency"
                    placeholder={`${tsidebar("examination_frequency")}`}
                    maxLength={50}
                    type="number"
                  />
                  <SMSInput
                    label={tsidebar("start_date")}
                    type="date"
                    value={sample?.start_date || ""}
                    onChange={(e) =>
                      handleInputChange(index, "start_date", e.target.value)
                    }
                    required
                    error={errors[index]?.start_date}
                  />
                </div>
              </div>

              <div className="hidden md:flex items-start gap-4">
                <div className="flex items-center pt-8 min-w-[30px] mt-4">
                  <span className="font-medium text-lg">{index + 1}.</span>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <SMSCombobox
                    label={`${tsidebar("locomotive")}`}
                    placeholder={`${tsidebar("locomotive")}`}
                    searchPlaceholder={t("search_locomotive")}
                    value={sample?.locomotive_id?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange(index, "locomotive_id", value)
                    }
                    options={locomotives.map((locomotive: any) => ({
                      value: locomotive.id?.toString(),
                      label: locomotive.name,
                    }))}
                    required
                    error={errors[index]?.locomotive_id}
                    hasMore={pagination.page < pagination.total_pages}
                    loadingMore={isLoadingProjects}
                    onLoadMore={handleLoadMoreLocomotives}
                    onSearch={handleSearchLocomotives}
                  />
                  <SMSInput
                    label={`${tsidebar("examination_frequency")}`}
                    value={sample.examination_frequency}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "examination_frequency",
                        e.target.value
                      )
                    }
                    required
                    error={errors[index]?.examination_frequency}
                    name="examination_frequency"
                    placeholder={`${tsidebar("examination_frequency")}`}
                    maxLength={50}
                    type="number"
                  />
                  <SMSInput
                    label={tsidebar("start_date")}
                    type="date"
                    value={sample?.start_date || ""}
                    onChange={(e) =>
                      handleInputChange(index, "start_date", e.target.value)
                    }
                    required
                    error={errors[index]?.start_date}
                  />
                </div>

                {!id && (
                  <div className="flex items-center space-x-2 pt-8 min-w-[80px] mt-4">
                    {samples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSampleEntry(index)}
                        className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                        aria-label={t("remove_sample")}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    {index === samples.length - 1 && (
                      <button
                        type="button"
                        onClick={addSampleEntry}
                        aria-label={t("add_sample")}
                        className="p-2"
                      >
                        <PlusCircle size={20} color="#3f8359" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${isDialog ? "flex-shrink-0 sticky bottom-0 bg-white pt-4 pb-2 " : ""} flex justify-center ${isDialog ? "" : "!mt-[129px]"} px-2`}
        >
          <SMSButton
            className="bg-black rounded-full w-full sm:w-auto min-w-[120px]"
            type="submit"
            loading={loading}
            loadingText={id ? t("updating_sampling") : t("creating_sampling")}
            text={id ? t("buttons.update") : t("actions.create")}
          />
        </div>
      </form>
    </div>
  );
};

export default SampleForm;

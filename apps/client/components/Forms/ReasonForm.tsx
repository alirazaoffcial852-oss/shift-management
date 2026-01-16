"use client";

import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useEffect, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { toast } from "sonner";
import { ReasonFormErrors, Reason, ReasonFormProps } from "../../types/reason";
import ReasonService from "../../services/reason";
import { useTranslations } from "next-intl";

const ReasonForm: React.FC<ReasonFormProps> = ({
  useComponentAs,
  id,
  onClose,
  isDialog = false,
  onSubmit,
  refetch,
}) => {
  const [reasons, setReasons] = useState<Reason[]>([
    {
      reason: "",
    },
  ]);

  const [errors, setErrors] = useState<ReasonFormErrors[]>([{}]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("common");
  const tValidation = useTranslations("common.validation");

  const handleInputChange = (
    index: number,
    field: keyof ReasonFormErrors,
    value: string
  ) => {
    const safeValue = value ?? "";

    setReasons((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: safeValue };
      return updated;
    });

    if (errors[index]?.[field]) {
      setErrors((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: undefined };
        return updated;
      });
    }
  };

  const addReasonEntry = () => {
    setReasons((prev) => [
      ...prev,
      {
        reason: "",
      },
    ]);
    setErrors((prev) => [...prev, {}]);
  };

  const removeReasonEntry = (index: number) => {
    if (reasons.length > 1) {
      setReasons((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ReasonFormErrors[] = [];
    let isValid = true;

    reasons.forEach((reason, index) => {
      const errorObj: ReasonFormErrors = {};

      if (!reason.reason?.trim()) {
        errorObj.reason = t("reason_required");
        isValid = false;
      }

      newErrors[index] = errorObj;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const validReasons = reasons
        .filter((reason) => reason.reason.trim() !== "")
        .map((reason) => ({
          reason: reason.reason.trim(),
        }));

      const formData = new FormData();
      formData.append("reasons", JSON.stringify(validReasons));

      const payload = {
        reasons: validReasons,
      };

      const response = await (id
        ? ReasonService.updateReason(id, payload)
        : ReasonService.createReasons(payload));

      if (response?.data) {
        onClose?.();
        onSubmit?.(true);
        refetch?.();
        toast.success(response?.message || t("operation_successfully"));
      }
    } catch (error) {
      console.error("Network error:", error);
      onSubmit?.(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useComponentAs === "EDIT" && id) {
      const fetchReason = async () => {
        const response = await ReasonService.getReasonById(id);
        if (response?.data) {
          setReasons([{ reason: response.data.reason }]);
        }
      };
      fetchReason();
    }
  }, [useComponentAs, id]);

  return (
    <div className={`${isDialog ? "flex flex-col h-full" : ""}`}>
      <form
        onSubmit={handleSubmit}
        className={`${isDialog ? "flex flex-col h-full" : "space-y-6"}`}
      >
        <div
          className={`${
            isDialog
              ? "flex-1 overflow-y-auto space-y-6 pr-2 pb-4"
              : "space-y-6"
          }`}
        >
          {reasons.map((reason, index) => (
            <div key={index} className="p-2 sm:p-4 mb-4 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <div className="md:w-[50%] flex items-center justify-center">
                  <SMSInput
                    label={t("reason")}
                    value={reason.reason}
                    onChange={(e) =>
                      handleInputChange(index, "reason", e.target.value)
                    }
                    required
                    error={errors[index]?.reason}
                    placeholder={t("enter_reason_description")}
                    maxLength={255}
                  />
                  <div className="flex items-center space-x-2 mt-8">
                    {reasons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReasonEntry(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label={t("remove_reason")}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {index === reasons.length - 1 &&
                      useComponentAs !== "EDIT" && (
                        <button
                          type="button"
                          onClick={addReasonEntry}
                          className="text-green-600 hover:text-green-800 p-2"
                          aria-label={t("add_reason")}
                        >
                          <PlusCircle size={18} />
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${
            isDialog
              ? "flex-shrink-0 sticky bottom-0 bg-white pt-4 pb-2"
              : "mt-8"
          } flex justify-center px-2`}
        >
          <SMSButton
            text={id ? t("buttons.update") : t("buttons.save")}
            className="bg-black rounded-full w-full sm:w-auto min-w-[120px]"
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default ReasonForm;

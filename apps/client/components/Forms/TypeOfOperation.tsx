"use client";
import { useCallback, useEffect, useState } from "react";
import TypeOfOperationService from "@/services/typeOfOperation";

import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { FORMMODE } from "@/types/shared/global";
import { useTranslations } from "next-intl";

interface TypeOfOperationFormProps {
  useComponentAs: FORMMODE;
  id?: string;
  onSuccess?: () => void;
  isDialog?: boolean;
}

interface FormData {
  name: string;
}

const TypeOfOperationForm = ({
  useComponentAs,
  isDialog,
  id,
  onSuccess,
}: TypeOfOperationFormProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const t = useTranslations("common");
  const tValidation = useTranslations("common.validation");

  const validateForm = () => {
    const newErrors: { name?: string } = {};
    if (!name) {
      newErrors.name = tValidation("name_required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchTypeOfOperationById = useCallback(async () => {
    if (!id) return;
    try {
      const response = await TypeOfOperationService.getTypeOfOperationById(
        Number(id)
      );
      const data = response.data;
      setName(data?.name);
    } catch (error) {
      console.error("Error fetching type of operation:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchTypeOfOperationById();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        const response = id
          ? await TypeOfOperationService.updateTypeOfOperation(
              Number(id),
              formData
            )
          : await TypeOfOperationService.createTypeOfOperation(formData);
        toast.success(response?.message || t("operation_successful"));
        if (isDialog) {
          if (onSuccess) onSuccess();
          return;
        }
        router.push("/settings/type-of-operation");
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(
          error instanceof Error ? error.message : t("an_error_occurred")
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-2 grid grid-cols-1 md:grid-cols-1 gap-6">
        <SMSInput
          label={t("labels.name")}
          placeholder={t("labels.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          error={errors.name}
          name="name"
          className="w-full"
        />
      </div>
      <div className="flex justify-end">
        <SMSButton
          text={t("buttons.save")}
          className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
          type="submit"
        />
      </div>
    </form>
  );
};

export default TypeOfOperationForm;

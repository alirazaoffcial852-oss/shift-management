"use client";
import { useCallback, useEffect, useState } from "react";
import costCenterService from "@/services/costCenter";

import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { FORMMODE } from "@/types/shared/global";
import { useTranslations } from "next-intl";

interface CostCenterFormProps {
  useComponentAs: FORMMODE;
  id?: string;
  onSuccess?: () => void;
  isDialog?: boolean;
}

interface FormData {
  name: string;
}

const CostCenterForm = ({
  useComponentAs,
  id,
  onSuccess,
  isDialog,
}: CostCenterFormProps) => {
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

  const fetchCostCenterById = useCallback(async () => {
    if (!id) return;
    try {
      const response = await costCenterService.getCostCenterById(Number(id));
      const data = response.data;
      setName(data?.name);
    } catch (error) {
      console.error("Error fetching cost center:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchCostCenterById();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        const response = id
          ? await costCenterService.updateCostCenter(Number(id), formData)
          : await costCenterService.createCostCenter(formData);
        toast.success(response?.message || t("operation_successful"));
        if (isDialog) {
          if (onSuccess) onSuccess();
          return;
        }
        router.push("/settings/cost-center");
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

export default CostCenterForm;

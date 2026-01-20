import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import LocomotiveService from "@/services/locomotive";
import { useState } from "react";
import { Company } from "@/types/configuration";
import { useTranslations } from "next-intl";
import { Locomotive, LocomotiveBasic } from "@/types/locomotive";
interface AddSubcategoryDialogProps {
  onAddSubcategory: (subcategory: Locomotive) => void;
  company: Company;
  open: boolean;
  onClose: () => void;
}
export const AddSubcategoryDialog = ({
  onAddSubcategory,
  company,
  open,
  onClose,
}: AddSubcategoryDialogProps) => {
  const [newSubcategory, setNewSubcategory] = useState<LocomotiveBasic>({
    name: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    from_location: "",
    to_location: "",
  });
  const t = useTranslations("common");
  const tcommon = useTranslations("common.labels");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { ...errors };

    if (!newSubcategory.name) {
      newErrors.name = t("validation.name_required");
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const formData = new FormData();
    formData.append("name", newSubcategory.name);
    if (company?.id) {
      formData.append("company_id", company.id.toString());
    }

    try {
      let response = await LocomotiveService.AddRoute(formData);

      onAddSubcategory(response.data);
      onClose();

      setNewSubcategory({ name: "" });
    } catch (error) {
      console.error("Failed to add subcategory:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => onClose()}>
      <DialogContent className="max-w-[585px] bg-white rounded-[32px] p-8">
        <div className="flex justify-center items-center mb-8">
          <DialogTitle className="text-[36px] font-semibold text-center">
            {t("lets_create")} {t("sub_category")}
          </DialogTitle>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <SMSInput
                label={`${t("sub_category")} ${tcommon("name")}`}
                value={newSubcategory.name}
                onChange={(e) =>
                  setNewSubcategory({ ...newSubcategory, name: e.target.value })
                }
                placeholder={`${t("enter")} ${t("sub_category")} ${tcommon("name")}`}
                error={errors.name}
                required
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <SMSButton type="submit" className="bg-[#2D2D2D] rounded-full px-8">
              {t("buttons.save")}
            </SMSButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

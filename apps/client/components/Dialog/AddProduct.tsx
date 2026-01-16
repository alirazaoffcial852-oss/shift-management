import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Label } from "@workspace/ui/components/label";
import { useState } from "react";
import { StepRenderer } from "@/components/Forms/product/StepRenderer";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useProductForm } from "@/hooks/product/useProductForm";
import {
  useSteps,
  useStepsForAddEdit,
  useStepsForCustomization,
} from "@/constants/product.constants";
import { Company } from "@/types/configuration";
import { CustomizeProductStepRenderer } from "../Forms/product/CustomizeProductStepRenderer";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  id?: string;
  setCustomizeProduct?: (product: any) => void;
}

const ProductForm = ({
  id,
  selectedOption = "add",
  setSelectedOption,
  onClose,
  setCustomizeProduct,
}: {
  id?: string;
  selectedOption?: string;
  onClose?: () => void;
  setCustomizeProduct?: (product: any) => void;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const productForm = useProductForm(
    id ? Number(id) : undefined,
    selectedOption,
    onClose,
    setCustomizeProduct
  );

  return (
    <FormLayout
      heading={
        <>
          Product{" "}
          {selectedOption
            ? selectedOption === "customize"
              ? "Customization"
              : selectedOption === "edit"
                ? "Update"
                : "Creation"
            : "Options"}
        </>
      }
      steps={
        selectedOption === "customize"
          ? useStepsForCustomization()
          : selectedOption === "edit" || "add"
            ? useStepsForAddEdit()
            : useSteps()
      }
      currentStep={productForm.currentStep}
      isDialog={true}
    >
      {id ? (
        <CustomizeProductStepRenderer
          {...productForm}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          company={productForm.company || ({} as Company)}
        />
      ) : (
        <StepRenderer
          {...productForm}
          company={productForm.company || ({} as Company)}
        />
      )}
    </FormLayout>
  );
};

export const AddProductDialog = ({
  open,
  onClose,
  id,
  setCustomizeProduct,
}: AddProductDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("add");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] rounded-[32px] h-[80vh] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col">
        <div className="flex-1 overflow-y-auto p-1 scrollbar">
          {id ? (
            <ProductForm
              id={id}
              setSelectedOption={setSelectedOption}
              selectedOption={selectedOption}
              onClose={onClose}
              setCustomizeProduct={(product) => {
                setCustomizeProduct?.(product);
                onClose?.();
              }}
            />
          ) : (
            <ProductForm
              onClose={onClose}
              setSelectedOption={setSelectedOption}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

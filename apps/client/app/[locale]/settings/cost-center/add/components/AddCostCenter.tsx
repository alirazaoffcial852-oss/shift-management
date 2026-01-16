"use client";
import CostCenterForm from "@/components/Forms/CostCenterForm";

interface AddCostCenterProps {
  onclose?: () => void;
  isDialog?: boolean;
}

const AddCostCenter = ({ onclose, isDialog }: AddCostCenterProps) => {
  return (
    <CostCenterForm
      useComponentAs="ADD"
      onSuccess={() => {
        if (onclose) onclose();
      }}
      isDialog={isDialog}
    />
  );
};

export default AddCostCenter;

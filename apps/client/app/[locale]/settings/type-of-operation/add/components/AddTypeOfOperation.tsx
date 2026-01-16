"use client";
import TypeOfOperationForm from "@/components/Forms/TypeOfOperation";

interface AddCostCenterProps {
  onclose?: () => void;
  isDialog?: boolean;
}

const AddTypeOfOperation = ({ onclose, isDialog }: AddCostCenterProps) => {
  return (
    <TypeOfOperationForm
      isDialog={isDialog}
      useComponentAs="ADD"
      onSuccess={() => {
        if (onclose) onclose();
      }}
    />
  );
};

export default AddTypeOfOperation;

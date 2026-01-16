"use client";
import CostCenterForm from "@/components/Forms/CostCenterForm";

const EditCostCenter = ({ id }: { id: string }) => {
  return <CostCenterForm useComponentAs="EDIT" id={id} />;
};

export default EditCostCenter;

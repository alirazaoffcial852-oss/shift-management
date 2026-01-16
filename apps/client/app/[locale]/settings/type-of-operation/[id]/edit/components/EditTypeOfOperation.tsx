"use client";
import TypeOfOperationForm from "@/components/Forms/TypeOfOperation";

const EditTypeOfOperation = ({ id }: { id: string }) => {
  return <TypeOfOperationForm useComponentAs="EDIT" id={id} />;
};

export default EditTypeOfOperation;

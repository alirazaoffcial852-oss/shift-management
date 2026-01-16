"use client";
import CustomerForm from "@/components/Forms/CustomerForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const EditCustomer = ({ id }: { id: string }) => {
  const tcommon = useTranslations("common");
  const tcustomer = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {tcustomer("customer")}
        </>
      }
    >
      <CustomerForm useComponentAs="EDIT" id={id} />
    </FormLayout>
  );
};

export default EditCustomer;

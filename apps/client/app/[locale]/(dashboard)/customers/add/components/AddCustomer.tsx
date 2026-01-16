"use client";
import CustomerForm from "@/components/Forms/CustomerForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const AddCustomer = ({
  onclose,
  isDialog = false,
}: {
  onclose?: () => void;
  isDialog?: boolean;
}) => {
  const tcommon = useTranslations("common");
  const tcustomer = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_create")} <br /> {tcustomer("customer")}
        </>
      }
      isDialog={isDialog}
    >
      <CustomerForm
        useComponentAs="ADD"
        onclose={onclose}
        isDialog={isDialog}
      />
    </FormLayout>
  );
};

export default AddCustomer;

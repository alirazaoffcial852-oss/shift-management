"use client";
import StaffForm from "@/components/Forms/StafForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const Addstaff = () => {
  const tcommon = useTranslations("common");
  const tcustomer = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_create")} <br /> {tcustomer("staff")}
        </>
      }
    >
      <StaffForm useComponentAs="ADD" />
    </FormLayout>
  );
};

export default Addstaff;

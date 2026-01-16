"use client";
import StaffForm from "@/components/Forms/StafForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const EditStaff = ({ id }: { id: string }) => {
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {tsidebar("staff")}
        </>
      }
    >
      <StaffForm useComponentAs="EDIT" id={id} isEditMode />
    </FormLayout>
  );
};

export default EditStaff;

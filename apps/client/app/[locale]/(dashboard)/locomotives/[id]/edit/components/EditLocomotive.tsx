"use client";
import LocomotiveForm from "@/components/Forms/Locomotive/locomotiveForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";
const EditLocomotive = ({ id }: { id: string }) => {
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {tsidebar("locomotive")}
        </>
      }
    >
      <LocomotiveForm useComponentAs="EDIT" id={id} />
    </FormLayout>
  );
};
export default EditLocomotive;

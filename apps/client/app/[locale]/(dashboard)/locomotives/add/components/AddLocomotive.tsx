"use client";
import LocomotiveForm from "@/components/Forms/Locomotive/locomotiveForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";
const AddLocomotive = () => {
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_create")} <br /> {tsidebar("locomotives")}
        </>
      }
    >
      <LocomotiveForm useComponentAs="ADD" />
    </FormLayout>
  );
};
export default AddLocomotive;

"use client";
import BvProjectForm from "@/components/Forms/BvProjectForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const EditBvProject = ({ id }: { id: string }) => {
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {tsidebar("bvProject")}
        </>
      }
    >
      <BvProjectForm useComponentAs="EDIT" id={id} />
    </FormLayout>
  );
};

export default EditBvProject;

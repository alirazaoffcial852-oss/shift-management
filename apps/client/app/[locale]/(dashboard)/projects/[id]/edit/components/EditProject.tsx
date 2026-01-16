"use client";
import ProjectForm from "@/components/Forms/ProjectForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const EditProject = ({ id }: { id: string }) => {
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {tsidebar("project")}
        </>
      }
    >
      <ProjectForm useComponentAs="EDIT" id={id} />
    </FormLayout>
  );
};

export default EditProject;

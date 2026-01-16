"use client";
import ProjectForm from "@/components/Forms/ProjectForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const AddProject = ({
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
          {tcommon("lets_create")} <br /> {tcustomer("project")}
        </>
      }
      isDialog={isDialog}
    >
      <ProjectForm useComponentAs="ADD" onclose={onclose} isDialog={isDialog} />
    </FormLayout>
  );
};

export default AddProject;

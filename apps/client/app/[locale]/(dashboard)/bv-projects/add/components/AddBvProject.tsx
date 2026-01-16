"use client";
import BvProjectForm from "@/components/Forms/BvProjectForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";

const AddBvProject = ({
  onclose,
  isDialog = false,
}: {
  onclose?: () => void;
  isDialog?: boolean;
}) => {
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_create")} <br /> {tsidebar("bvProject")}
        </>
      }
      isDialog={isDialog}
    >
      <BvProjectForm
        useComponentAs="ADD"
        onclose={onclose}
        isDialog={isDialog}
      />
    </FormLayout>
  );
};

export default AddBvProject;

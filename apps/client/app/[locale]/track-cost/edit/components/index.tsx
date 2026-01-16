"use client";
import { useParams } from "next/navigation";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";
import EditTrackCostForm from "./editTrackCostForm";

const EditTrackCost = () => {
  const tcommon = useTranslations("common");
  const params = useParams();

  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {"Train Path Cost"}
        </>
      }
    >
      <EditTrackCostForm />
    </FormLayout>
  );
};

export default EditTrackCost;

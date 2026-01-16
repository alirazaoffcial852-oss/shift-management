"use client";
import { useParams } from "next/navigation";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useTranslations } from "next-intl";
import AddTrackCostForm from "./AddTrackCostForm";

const AddTrackCost = () => {
  const tcommon = useTranslations("common");
  const tTrackCost = useTranslations("pages.trackCost");
  const params = useParams();

  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_create")} <br /> {tTrackCost("trainPathCost")}
        </>
      }
    >
      <AddTrackCostForm />
    </FormLayout>
  );
};

export default AddTrackCost;

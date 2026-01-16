import { ClientForm } from "@/components/Forms/Client";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import React from "react";

type PageProps = Promise<{
  id: string;
}>;

const EditClientPage = async ({ params }: { params: PageProps }) => {
  const { id } = await params;
  return (
    <FormLayout
      heading={
        <>
          Edit Client <br /> Details
        </>
      }
    >
      <ClientForm useComponentAs="EDIT" id={id} />
    </FormLayout>
  );
};

export default EditClientPage;

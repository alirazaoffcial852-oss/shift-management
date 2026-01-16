import { ClientForm } from "@/components/Forms/Client";
import FormLayout from "@workspace/ui/components/custom/FormLayout";

const AddClient = () => {
  return (
    <FormLayout
      heading={
        <>
          Let’s Create <br /> Client
        </>
      }
    >
      <ClientForm useComponentAs="ADD" />
    </FormLayout>
  );
};

export default AddClient;

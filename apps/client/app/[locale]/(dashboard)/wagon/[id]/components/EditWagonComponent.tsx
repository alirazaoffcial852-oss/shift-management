"use client";
import { useParams } from "next/navigation";
import AddWagonForm from "@/components/Forms/AddWagonList";

const EditWagonComponent: React.FC = () => {
  const params = useParams();
  const id = params.id ? parseInt(params.id as string) : undefined;

  return <AddWagonForm id={id} />;
};

export default EditWagonComponent;

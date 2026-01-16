import LocationForm from "@/components/Forms/location";

interface EditLocationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLocationPage({
  params,
}: EditLocationPageProps) {
  const resolvedParams = await params;
  const locationId = parseInt(resolvedParams.id);

  return <LocationForm id={locationId} />;
}

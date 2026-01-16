import AddWagonForm from "@/components/Forms/AddWagonList";

interface EditWagonListPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditWagonListPage({
  params,
}: EditWagonListPageProps) {
  const resolvedParams = await params;
  const wagonId = parseInt(resolvedParams.id);

  return <AddWagonForm id={wagonId} />;
}

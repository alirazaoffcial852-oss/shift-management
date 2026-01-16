import EditProjectUsnProduct from "./components/EditProjectUsnProduct";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectUsnProductPage({ params }: PageProps) {
  const { id } = await params;
  return <EditProjectUsnProduct productId={id} />;
}

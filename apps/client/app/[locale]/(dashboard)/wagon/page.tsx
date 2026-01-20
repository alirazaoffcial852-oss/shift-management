import WagonTableComponent from "./components/wagon-table";

interface WagonPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function WagonPage({ searchParams }: WagonPageProps) {
  const resolvedSearchParams = await searchParams;
  return <WagonTableComponent searchParams={resolvedSearchParams}  />;
}

import { PageProps } from "@/types/shared/pageProps";
import EditHoliday from "./components/EditHoliday";

const page = async ({ params }: { params: PageProps }) => {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <EditHoliday id={id} />
    </div>
  );
};

export default page;

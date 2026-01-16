import { PageProps } from "@/types/shared/pageProps";
import React from "react";
import EditTypeOfOperation from "./components/EditTypeOfOperation";

const page = async ({ params }: { params: PageProps }) => {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <EditTypeOfOperation id={id} />
    </div>
  );
};

export default page;

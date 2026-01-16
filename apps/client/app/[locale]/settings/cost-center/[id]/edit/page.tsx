import { PageProps } from "@/types/shared/pageProps";
import React from "react";
import EditCostCenter from "./components/EditCostCenter";

const page = async ({ params }: { params: PageProps }) => {
  const { id } = await params;

  return <EditCostCenter id={id} />;
};

export default page;

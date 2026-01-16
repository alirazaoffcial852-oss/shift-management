import { PageProps } from "@/types/shared/pageProps";
import React from "react";
import EditProduct from "./components/EditProduct";

const page = async ({ params }: { params: PageProps }) => {
  const { id } = await params;

  return <EditProduct id={id} />;
};

export default page;

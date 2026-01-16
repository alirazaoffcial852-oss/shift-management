import { PageProps } from "@/types/shared/pageProps";
import React from "react";
import EditLocomotive from "./components/EditLocomotive";

const page = async ({ params }: { params: PageProps }) => {
  const { id } = await params;

  return <EditLocomotive id={id} />;
};

export default page;

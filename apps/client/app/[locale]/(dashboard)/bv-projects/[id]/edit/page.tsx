import { PageProps } from "@/types/shared/pageProps";
import React from "react";
import EditBvProject from "./components/EditBvProject";

const page = async ({ params }: { params: PageProps }) => {
  const { id } = await params;

  return <EditBvProject id={id} />;
};

export default page;

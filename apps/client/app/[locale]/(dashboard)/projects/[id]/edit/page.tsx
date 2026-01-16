import React from "react";
import { PageProps } from "@/types/shared/pageProps";
import EditProject from "./components/EditProject";

const editPage = async ({ params }: { params: PageProps }) => {
  const { id } = await params;
  return <EditProject id={id} />;
};

export default editPage;

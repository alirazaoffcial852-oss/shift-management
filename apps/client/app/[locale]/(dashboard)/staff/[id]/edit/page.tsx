import React from "react";
import { PageProps } from "@/types/shared/pageProps";
import EditStaff from "./components/EditStaff";

const editPage = async ({ params }: { params: PageProps }) => {
  const { id } = await params;
  return <EditStaff id={id} />;
};

export default editPage;

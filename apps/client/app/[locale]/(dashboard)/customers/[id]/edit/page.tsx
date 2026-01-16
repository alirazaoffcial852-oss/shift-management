import React from "react";
import EditCustomer from "./components/EditCustomer";
import { PageProps } from "@/types/shared/pageProps";

const editPage = async ({ params }: { params: PageProps }) => {
  const { id } = await params;
  return <EditCustomer id={id} />;
};

export default editPage;

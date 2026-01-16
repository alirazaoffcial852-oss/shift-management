import { PageProps } from "@/types/shared/pageProps";
import React from "react";
import EditEmployee from "./components/EditEmployee";

const page = async ({ params }: { params: PageProps }) => {
  const { id } = await params;

  return <EditEmployee id={id} />;
};

export default page;

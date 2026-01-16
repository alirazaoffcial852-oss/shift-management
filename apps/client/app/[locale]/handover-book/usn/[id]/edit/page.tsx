"use client";

import { useParams } from "next/navigation";
import HandoverBookForm from "@/components/Forms/HandoverBook/HandoverBookForm";

export default function EditUSNHandoverBookPage() {
  const params = useParams();
  const id = params?.id as string;

  return <HandoverBookForm handoverBookId={id} isUSN={true} />;
}


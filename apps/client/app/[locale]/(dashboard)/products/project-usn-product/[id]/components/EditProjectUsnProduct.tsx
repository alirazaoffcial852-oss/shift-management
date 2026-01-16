"use client";

import ProjectUsnProductForm from "../../components/ProjectUsnProductForm";

interface EditClientProps {
  productId: string;
}

export default function EditProjectUsnProduct({ productId }: EditClientProps) {
  return <ProjectUsnProductForm productId={productId} />;
}

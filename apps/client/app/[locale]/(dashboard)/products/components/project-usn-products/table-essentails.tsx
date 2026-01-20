import { ProjectUsnProduct } from "@/types/project-usn-product";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Edit2Icon, Trash2, Grid2x2 } from "lucide-react";
import Link from "next/link";
import { STATUS } from "@/types/shared/global";
import { useTranslations } from "next-intl";

export const useProjectUsnProductColumns = () => {
  const tSidebar = useTranslations("components.sidebar");
  const tProduct = useTranslations("pages.products");

  return [
    {
      header: tProduct("supplier"),
      accessor: "supplier",
      render: (value: any) =>
        value?.name || `${tProduct("supplier")} #${value?.id || "N/A"}`,
    },
    {
      header: tSidebar("customer"),
      accessor: "customer",
      render: (value: any) => value?.name || `Customer #${value?.id || "N/A"}`,
    },
  ];
};

export type ProjectUsnProductActionCallbacks = {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
  onViewMatrix: (product: ProjectUsnProduct) => void;
};

export const getProjectUsnProductActions = (
  callbacks: ProjectUsnProductActionCallbacks
) => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");

  return [
    {
      label: "Product Matrix",
      element: (product: ProjectUsnProduct) => (
        <button
          onClick={() => callbacks.onViewMatrix(product)}
          className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Grid2x2 className="w-4 h-4 text-gray-800" />
            <span className="text-sm text-gray-800">Product Matrix</span>
          </span>
        </button>
      ),
    },
    {
      label: tActions("edit"),
      element: (product: ProjectUsnProduct) => (
        <Link
          href={`/products/project-usn-product/${product.id}`}
          className="w-full block py-2 px-3 hover:bg-green-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">{tActions("edit")}</span>
          </span>
        </Link>
      ),
    },
    {
      label: tActions("delete"),
      element: (product: ProjectUsnProduct) => (
        <ActionButton
          item={{ ...product, id: product.id ?? 0 }}
          customConfig={{
            show: true,
            title: tMessages("delete"),
            description: `${tMessages("deleteConfirm")} Project USN ${tLabel("product")} ${tMessages("commonMessage")} <b>Product #${product.id}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              callbacks.onDelete(id);
            },
          }}
        />
      ),
    },
  ];
};

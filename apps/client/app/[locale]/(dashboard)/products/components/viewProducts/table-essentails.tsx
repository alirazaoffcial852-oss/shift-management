import { Product } from "@/types/product";
import ProductService from "@/services/product";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Activity, Archive, Copy, Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { STATUS } from "@/types/shared/global";
import { useTranslations } from "next-intl";


export const usePrductColumns = () => {
  const t = useTranslations("common.labels");
  const tSidebar = useTranslations("components.sidebar");
  const tProduct = useTranslations("pages.products");
  return [
    { header: t("name"), accessor: "name" },
    {
      header: tSidebar("customer") + " " + t("name"),
      accessor: "customer.name",
    },
    { header: tProduct("toll_cost"), accessor: "toll_cost" },
  ];
};

export type ProductActionCallbacks = {
  onDelete: (id: number) => void;
  onDuplicate: (product: Product) => Promise<void>;
  onStatusUpdate: (id: number, status: STATUS) => void;
};

export const getActions = (callbacks: ProductActionCallbacks) => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");
  return [
    {
      label: tActions("edit"),
      element: (product: Product) => (
        <Link
          href={`/products/${product.id}/edit`}
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
      element: (product: Product) => (
        <ActionButton
          item={{ ...product, id: product.id ?? 0 }}
          customConfig={{
            show: true,
            title: tMessages("delete"),
            description: `${tMessages("deleteConfirm")} ${tLabel("product")}  ${tMessages("commonMessage")} <b>${product.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await ProductService.deleteProduct(
                  id.toString()
                );
                callbacks.onDelete(id);
                toast.success(response?.message);
              } catch (error) {
                toast.error(
                  (error as any)?.data?.message || tMessages("error_occurred")
                );
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("duplicate"),
      element: (product: Product) => (
        <ActionButton
          item={{ ...product, id: product.id ?? 0 }}
          customConfig={{
            show: true,
            title: tActions("duplicate"),
            description: `${tMessages("duplicateConfirm")} ${tLabel("product")}  ${tMessages("commonMessage")} <b>${product.name}</b>? ${tMessages("duplicateWarning")}`,
            confirmText: tActions("duplicate"),
            buttonText: tActions("duplicate"),
            variant: "default",
            icon: Copy,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            deleteClient: async () => {
              try {
                await callbacks.onDuplicate(product);
              } catch (error) {
                toast.error(
                  (error as any)?.data?.message ||
                    tMessages("duplicate_product_failed")
                );
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("archive"),
      element: (product: Product) => (
        <ActionButton
          item={{ ...product, id: product.id ?? 0, name: product.name }}
          customConfig={{
            show: product.status !== "ARCHIVED",
            title: tMessages("archive"),
            description: `${tMessages("archiveConfirm")}${tLabel("product")}  ${tMessages("commonMessage")} <b>${product.name}</b>? ${tMessages("archiveWarning")}`,
            confirmText: tActions("archive"),
            buttonText: tActions("archive"),
            variant: "default",
            icon: Archive,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            archivedProduct: async (id: number) => {
              try {
                let response = await ProductService.archivedProduct(
                  id.toString()
                );
                callbacks.onStatusUpdate(id, "ARCHIVED");
                toast.success(response?.message);
              } catch (error) {
                toast.error(
                  (error as any)?.data?.message || tMessages("error_occurred")
                );
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("activate"),
      element: (product: Product) => (
        <ActionButton
          item={{ ...product, id: product.id ?? 0, name: product.name }}
          customConfig={{
            show: product.status !== "ACTIVE",
            title: tMessages("activate"),
            description: `${tMessages("activateConfirm")} ${tLabel("product")}  ${tMessages("commonMessage")} <b>${product.name}</b>? ${tMessages("activateWarning")}`,
            confirmText: tActions("activate"),
            buttonText: tActions("activate"),
            variant: "default",
            icon: Activity,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            activateProduct: async (id: number) => {
              try {
                let response = await ProductService.activateProduct(
                  id.toString()
                );
                callbacks.onStatusUpdate(id, "ACTIVE");
                toast.success(response?.message);
              } catch (error) {
                toast.error(
                  (error as any)?.data?.message || tMessages("error_occurred")
                );
                throw error;
              }
            },
          }}
        />
      ),
    },
  ];
};

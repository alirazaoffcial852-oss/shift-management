import { Activity, Archive, Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import CustomerService from "@/services/customer";
import { toast } from "sonner";
import { CustomerActionCallbacks } from "@/types/components/table";
import { useTranslations } from "next-intl";

export const getColumns = () => {
  const t = useTranslations("common.labels");
  const tCommon = useTranslations("common");

  return [
    { header: t("name"), accessor: "name" },
    { header: t("email"), accessor: "email" },
    { header: t("phone"), accessor: "phone" },
    { header: tCommon("address"), accessor: "address" },
    { header: tCommon("city"), accessor: "city" },
    { header: tCommon("postal_code"), accessor: "postal_code" },
  ];
};

export const getActions = () => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");

  return [
    {
      label: tActions("edit"),
      element: (item: { id: number; name: string }) => (
        <Link href={`/customers/${item.id}/edit`} className="w-full block py-2 px-3 hover:bg-green-50 transition-colors">
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">{tActions("edit")}</span>
          </span>
        </Link>
      ),
    },
    {
      label: tActions("delete"),
      element: (item: { id: number; name: string }, { onDelete }: Pick<CustomerActionCallbacks, "onDelete">) => (
        <ActionButton
          item={{ ...item, id: item.id ?? 0 }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")} ${tLabel("customer")}  ${tMessages("commonMessage")} <b>${item.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await CustomerService.deleteCustomer(id.toString());
                onDelete(id);
                toast.success(response?.message);
              } catch (error) {
                toast.error((error as any)?.data?.message || tMessages("errorOccurred"));
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("archive"),
      element: (item: { id: number; name: string; status: string }, { onStatusUpdate }: Pick<CustomerActionCallbacks, "onStatusUpdate">) => (
        <ActionButton
          item={{ ...item, id: item.id ?? 0, name: item.name }}
          customConfig={{
            show: item.status !== "ARCHIVED",
            title: tActions("archive"),
            description: `${tMessages("archiveConfirm")} ${tLabel("customer")}  ${tMessages("commonMessage")} <b>${item.name}</b>?`,
            confirmText: tActions("archive"),
            buttonText: tActions("archive"),
            variant: "default",
            icon: Archive,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            archivedProduct: async (id: number) => {
              try {
                const formData = new FormData();
                formData.append("status", "ARCHIVED");
                let response = await CustomerService.archivedCustomer(id.toString(), formData);
                onStatusUpdate(id, "ARCHIVED");
                toast.success(response?.message);
              } catch (error) {
                toast.error((error as any)?.data?.message || tMessages("errorOccurred"));
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("activate"),
      element: (item: { id: number; name: string; status: string }, { onStatusUpdate }: Pick<CustomerActionCallbacks, "onStatusUpdate">) => (
        <ActionButton
          item={{ ...item, id: item.id ?? 0, name: item.name }}
          customConfig={{
            show: item.status !== "ACTIVE",
            title: tActions("activate"),
            description: `${tMessages("activateConfirm")}  ${tLabel("customer")}  ${tMessages("commonMessage")} <b>${item.name}</b>?`,
            confirmText: tActions("activate"),
            buttonText: tActions("activate"),
            variant: "default",
            icon: Activity,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            activateProduct: async (id: number) => {
              try {
                const formData = new FormData();
                formData.append("status", "ACTIVE");
                let response = await CustomerService.activateCustomer(id.toString(), formData);
                onStatusUpdate(id, "ACTIVE");
                toast.success(response?.message);
              } catch (error) {
                toast.error((error as any)?.data?.message || tMessages("errorOccurred"));
                throw error;
              }
            },
          }}
        />
      ),
    },
  ];
};

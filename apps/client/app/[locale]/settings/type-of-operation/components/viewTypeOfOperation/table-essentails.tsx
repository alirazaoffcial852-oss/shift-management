import { Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import TypeOfOperationService from "@/services/typeOfOperation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const getColumns = () => {
  const t = useTranslations("common.labels");

  return [{ header: t("name"), accessor: "name" }];
};
export type typeOfoperationActionCallbacks = {
  onDelete: (id: number) => void;
};

export const getActions = () => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");

  return [
    {
      label: tActions("edit"),
      element: (item: { id: number; name: string }) => (
        <Link href={`/settings/type-of-operation/${item.id}/edit`} className="w-full block py-2 px-3 hover:bg-green-50 transition-colors">
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">{tActions("edit")}</span>
          </span>
        </Link>
      ),
    },
    {
      label: tActions("delete"),
      element: (item: { id: number; name: string }, { onDelete }: Pick<typeOfoperationActionCallbacks, "onDelete">) => (
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
                let response = await TypeOfOperationService.deleteTypeOfOperation(id);
                onDelete(id);
                toast(response?.message);
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

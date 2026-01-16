import { Role, RoleFormData } from "@/types/role";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import CompanyService from "@/services/company";
import { toast } from "sonner";
import { Edit2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const getColumns = () => {
  const t = useTranslations("pages.roles");
  return [
    { header: t("name"), accessor: "name" },
    { header: t("assignTo"), accessor: "act_as" },
  ];
};
export const getActions = () => {
  const tActions = useTranslations("actions");
  const tRoles = useTranslations("pages.roles");
  return [
    {
      label: tActions("edit"),
      element: (
        role: RoleFormData,
        { onEdit }: { onEdit: (role: RoleFormData) => void }
      ) => (
        <button
          onClick={() => onEdit(role)}
          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-gray-600 w-full"
        >
          <Edit2 className="h-4 w-4" />
          {tActions("edit")}
        </button>
      ),
    },
    {
      label: tActions("delete"),
      element: (
        customer: Role,
        { onDelete }: { onDelete: (id: number) => void }
      ) => (
        <ActionButton
          item={{ ...customer, id: customer.id ?? 0 }}
          customConfig={{
            show: true,
            title: tRoles("deleteRole"),
            description: `${tRoles("areYouSureYouWantToDeleteTheRole")} <b>${customer.name}</b>? ${tRoles("thisWillRemoveAllOfItsDataThisActionCannotBeUndone")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let responce = await CompanyService.deleteRoles(id);
                onDelete(id);
                toast(responce?.message);
              } catch (error) {
                toast.error(
                  (error as any)?.data?.message || "An error occurred"
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

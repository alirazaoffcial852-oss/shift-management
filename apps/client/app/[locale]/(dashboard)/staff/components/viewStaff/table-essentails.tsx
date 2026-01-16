import { Staff } from "@/types/staff";
import StaffService from "@/services/staff";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Activity, Archive, Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { STATUS } from "@/types/shared/global";
import { useTranslations } from "next-intl";

export const getColumns = () => {
  const t = useTranslations("common.labels");
  return [
    { header: t("name"), accessor: "name" },
    { header: t("email"), accessor: "email" },
    { header: t("phone"), accessor: "phone" },
    { header: t("role"), accessor: "role.name" },
  ];
};

export type StaffActionCallbacks = {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
};

export const getActions = () => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");

  return [
    {
      label: tActions("edit"),
      element: (staff: Staff) => (
        <Link
          href={`/staff/${staff.id}/edit`}
          className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-gray-800" />
            <span className="text-sm text-gray-800">{tActions("edit")}</span>
          </span>
        </Link>
      ),
    },
    {
      label: tActions("delete"),
      element: (
        staff: Staff,
        { onDelete }: Pick<StaffActionCallbacks, "onDelete">
      ) => (
        <ActionButton
          item={{ ...staff, id: staff.id ?? 0 }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")} ${tLabel("staff")}  ${tMessages("commonMessage")} <b>${staff.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await StaffService.deleteStaff(id.toString());
                onDelete(id);
                toast(response?.message);
              } catch (error) {
                toast(
                  (error as any)?.data?.message || tMessages("errorOccurred")
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
      element: (
        staff: Staff,
        { onStatusUpdate }: Pick<StaffActionCallbacks, "onStatusUpdate">
      ) => (
        <ActionButton
          item={{ ...staff, id: staff.id ?? 0, name: staff.name }}
          customConfig={{
            show: staff.status !== "ARCHIVED",
            title: tActions("archive"),
            description: `${tMessages("archiveConfirm")} ${tLabel("staff")}  ${tMessages("commonMessage")} <b>${staff.name}</b>?`,
            confirmText: tActions("archive"),
            buttonText: tActions("archive"),
            variant: "destructive",
            icon: Archive,
            style: "hover:bg-red-50 text-blue-600",
          }}
          services={{
            archivedStaff: async (id: number) => {
              try {
                let response = await StaffService.archivedStaff(id.toString());
                onStatusUpdate(id, "ARCHIVED");
                toast(response?.message);
              } catch (error) {
                toast(
                  (error as any)?.data?.message || tMessages("errorOccurred")
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
      element: (
        staff: Staff,
        { onStatusUpdate }: Pick<StaffActionCallbacks, "onStatusUpdate">
      ) => (
        <ActionButton
          item={{ ...staff, id: staff.id ?? 0, name: staff.name }}
          customConfig={{
            show: staff.status !== "ACTIVE",
            title: tActions("activate"),
            description: `${tMessages("activateConfirm")} ${tLabel("staff")}  ${tMessages("commonMessage")} <b>${staff.name}</b>?`,
            confirmText: tActions("activate"),
            buttonText: tActions("activate"),
            variant: "destructive",
            icon: Activity,
            style: "hover:bg-red-50 text-blue-600",
          }}
          services={{
            activateStaff: async (id: number) => {
              try {
                let response = await StaffService.activateStaff(id.toString());
                onStatusUpdate(id, "ACTIVE");
                toast(response?.message);
              } catch (error) {
                toast(
                  (error as any)?.data?.message || tMessages("errorOccurred")
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

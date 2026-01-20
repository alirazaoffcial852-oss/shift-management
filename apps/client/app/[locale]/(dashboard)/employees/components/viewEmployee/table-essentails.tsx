import { Employee } from "@/types/employee";
import EmployeeService from "@/services/employee";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Activity, Archive, Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { STATUS } from "@/types/shared/global";
import { useTranslations } from "next-intl";
import { sendResetPasswordLinkToEmployee } from "@/utils/passwordReset";

export const useEmployeeColumns = () => {
  const t = useTranslations("common.labels");
  const trates = useTranslations("components.rate");
  return [
    { header: t("name"), accessor: "name" },
    { header: t("email"), accessor: "email" },
    { header: t("phone"), accessor: "phone" },
    { header: t("role"), accessor: "role.name" },
    { header: trates("costing_terms"), accessor: "pricing.costing_terms" },
    {
      header: trates("far_away_hourly_rate"),
      accessor: "pricing.far_away_hourly_rate",
    },
    {
      header: trates("nearby_hourly_rate"),
      accessor: "pricing.nearby_hourly_rate",
    },
  ];
};

export type EmployeeActionCallbacks = {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
};

export const useEmployeeActions = (callbacks: EmployeeActionCallbacks) => {
  const tActions = useTranslations("actions");
  const tAuth = useTranslations("pages.auth");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");
  return [
    {
      label: tActions("edit"),
      element: (employee: Employee) => (
        <Link
          href={`/employees/${employee.id}/edit`}
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
      element: (employee: Employee) => (
        <ActionButton
          item={{
            ...employee,
            id: employee.id ?? 0,
            name: employee?.name || "",
          }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")}  ${tLabel("employee")}  ${tMessages("commonMessage")} <b>${employee.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await EmployeeService.deleteEmployee(
                  id.toString()
                );
                callbacks.onDelete(id);
                toast(response?.message);
              } catch (error) {
                toast((error as any)?.data?.message || "An error occurred");
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("archive"),
      element: (employee: Employee) => (
        <ActionButton
          item={{
            ...employee,
            id: employee.id ?? 0,
            name: employee?.name || "",
          }}
          customConfig={{
            show: employee.status !== "ARCHIVED",
            title: tActions("archive"),
            description: `${tMessages("archiveConfirm")}  ${tLabel("employee")}  ${tMessages("commonMessage")} <b>${employee.name}</b>? ${tMessages("archiveWarning")}`,
            confirmText: tActions("archive"),
            buttonText: tActions("archive"),
            variant: "default",
            icon: Archive,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            archivedProduct: async (id: number) => {
              try {
                let response = await EmployeeService.archivedEmployee(
                  id.toString()
                );
                callbacks.onStatusUpdate(id, "ARCHIVED");
                toast(response?.message);
              } catch (error) {
                toast((error as any)?.data?.message || "An error occurred");
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("activate"),
      element: (employee: Employee) => (
        <ActionButton
          item={{
            ...employee,
            id: employee.id ?? 0,
            name: employee?.name || "",
          }}
          customConfig={{
            show: employee.status !== "ACTIVE",
            title: tActions("activate"),
            description: `${tMessages("activateConfirm")}  ${tLabel("employee")}  ${tMessages("commonMessage")} <b>${employee.name}</b>? ${tMessages("activateWarning")}`,
            confirmText: tActions("activate"),
            buttonText: tActions("activate"),
            variant: "default",
            icon: Activity,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            activateProduct: async (id: number) => {
              try {
                let response = await EmployeeService.activeEmployee(
                  id.toString()
                );
                callbacks.onStatusUpdate(id, "ACTIVE");
                toast(response?.message);
              } catch (error) {
                toast((error as any)?.data?.message || "An error occurred");
                throw error;
              }
            },
          }}
        />
      ),
    },
    {
      label: tAuth("resetPassword"),
      element: (employee: Employee) => (
        <ActionButton
          item={{
            ...employee,
            id: employee.id ?? 0,
            name: employee?.name || "",
            email: employee?.email || "",
          }}
          customConfig={{
            show: true,
            title: tAuth("resetPassword"),
            description: `${tMessages("resetPassword")}  <b> ${employee?.email || ""}</b>?`,
            confirmText: tAuth("resetPassword"),
            buttonText: tAuth("resetPassword"),
            variant: "default",
            icon: Activity,
            style: "hover:bg-blue-50 text-blue-600",
          }}
          services={{
            sendResetPasswordLink: async (id: number, onClose: () => void) => {
              await sendResetPasswordLinkToEmployee(
                employee?.email || "",
                onClose
              );
            },
          }}
        />
      ),
    },
  ];
};

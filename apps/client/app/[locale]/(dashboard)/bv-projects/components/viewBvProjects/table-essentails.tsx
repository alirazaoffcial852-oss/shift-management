import { BvProject } from "@/types/bvProject";
import BvProjectService from "@/services/bvProject";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Activity, Archive, Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { STATUS } from "@/types/shared/global";
import { useTranslations } from "next-intl";

export const getColumns = () => {
  const t = useTranslations("common.labels");
  const tsidebar = useTranslations("components.sidebar");
  return [
    { header: t("name"), accessor: "name" },
    {
      header: tsidebar("project") + " " + t("name"),
      accessor: "project.name",
    },
  ];
};

export type BvProjectActionCallbacks = {
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
      element: (bvProject: BvProject) => (
        <Link href={`/bv-projects/${bvProject.id}/edit`} className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors">
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-gray-800" />
            <span className="text-sm text-gray-800">{tActions("edit")}</span>
          </span>
        </Link>
      ),
    },
    {
      label: tActions("delete"),
      element: (bvProject: BvProject, { onDelete }: Pick<BvProjectActionCallbacks, "onDelete">) => (
        <ActionButton
          item={{ ...bvProject, id: bvProject.id ?? 0 }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")} ${tLabel("bvProject")}  ${tMessages("commonMessage")} <b>${bvProject.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await BvProjectService.deleteBvProject(id.toString());
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
      element: (bvProject: BvProject, { onStatusUpdate }: Pick<BvProjectActionCallbacks, "onStatusUpdate">) => (
        <ActionButton
          item={{ ...bvProject, id: bvProject.id ?? 0, name: bvProject.name }}
          customConfig={{
            show: bvProject.status !== "ARCHIVED",
            title: tActions("archive"),
            description: `${tMessages("archiveConfirm")}  ${tLabel("bvProject")}  ${tMessages("commonMessage")} <b>${bvProject.name}</b>?`,
            confirmText: tActions("archive"),
            buttonText: tActions("archive"),
            variant: "destructive",
            icon: Archive,
            style: "hover:bg-red-50 text-blue-600",
          }}
          services={{
            archivedProject: async (id: number) => {
              try {
                const formData = new FormData();
                formData.append("status", "ARCHIVED");
                let response = await BvProjectService.archivedBvProject(id.toString(), formData);
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
      element: (bvProject: BvProject, { onStatusUpdate }: Pick<BvProjectActionCallbacks, "onStatusUpdate">) => (
        <ActionButton
          item={{ ...bvProject, id: bvProject.id ?? 0, name: bvProject.name }}
          customConfig={{
            show: bvProject.status !== "ACTIVE",
            title: tActions("activate"),
            description: `${tMessages("activateConfirm")}  ${tLabel("bvProject")}  ${tMessages("commonMessage")}  <b>${bvProject.name}</b>?`,
            confirmText: tActions("activate"),
            buttonText: tActions("activate"),
            variant: "destructive",
            icon: Activity,
            style: "hover:bg-red-50 text-blue-600",
          }}
          services={{
            activateProject: async (id: number) => {
              try {
                const formData = new FormData();
                formData.append("status", "ACTIVE");
                let response = await BvProjectService.activateBvProject(id.toString(), formData);
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

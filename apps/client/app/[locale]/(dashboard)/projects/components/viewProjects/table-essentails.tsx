import { Project } from "@/types/project";
import ProjectService from "@/services/project";
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
      header: tsidebar("customer") + " " + t("name"),
      accessor: "customer.name",
    },
  ];
};

export type ProjectActionCallbacks = {
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
      element: (project: Project) => (
        <Link href={`/projects/${project.id}/edit`} className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors">
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-gray-800" />
            <span className="text-sm text-gray-800">{tActions("edit")}</span>
          </span>
        </Link>
      ),
    },
    {
      label: tActions("delete"),
      element: (project: Project, { onDelete }: Pick<ProjectActionCallbacks, "onDelete">) => (
        <ActionButton
          item={{ ...project, id: project.id ?? 0 }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")}  ${tLabel("project")}  ${tMessages("commonMessage")} <b>${project.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await ProjectService.deleteProject(id.toString());
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
    {
      label: tActions("archive"),
      element: (project: Project, { onStatusUpdate }: Pick<ProjectActionCallbacks, "onStatusUpdate">) => (
        <ActionButton
          item={{ ...project, id: project.id ?? 0, name: project.name }}
          customConfig={{
            show: project.status !== "ARCHIVED",
            title: tActions("archive"),
            description: `${tMessages("archiveConfirm")} ${tLabel("project")}  ${tMessages("commonMessage")} <b>${project.name}</b>?`,
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
                let response = await ProjectService.archivedProject(id.toString(), formData);
                onStatusUpdate(id, "ARCHIVED");
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
    {
      label: tActions("activate"),
      element: (project: Project, { onStatusUpdate }: Pick<ProjectActionCallbacks, "onStatusUpdate">) => (
        <ActionButton
          item={{ ...project, id: project.id ?? 0, name: project.name }}
          customConfig={{
            show: project.status !== "ACTIVE",
            title: tActions("activate"),
            description: `${tMessages("activateConfirm")} ${tLabel("project")}  ${tMessages("commonMessage")} <b>${project.name}</b>?`,
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
                let response = await ProjectService.activateProject(id.toString(), formData);
                onStatusUpdate(id, "ACTIVE");
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

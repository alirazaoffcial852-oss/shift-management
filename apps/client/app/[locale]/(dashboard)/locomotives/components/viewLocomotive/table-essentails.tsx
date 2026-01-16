import { Locomotive } from "@/types/locomotive";
import LocomotiveService from "@/services/locomotive";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Edit2Icon, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { STATUS } from "@/types/shared/global";

export const useLocomotiveColumns = () => {
  const tlocomotive = useTranslations("pages.locomotives");
  const t = useTranslations("actions");

  return [
    { header: tlocomotive("name"), accessor: "name" },
    { header: tlocomotive("model_type"), accessor: "model_type" },
    { header: tlocomotive("engine"), accessor: "engine" },
    { header: tlocomotive("year"), accessor: "year" },
  ];
};

export type LocomotiveActionCallbacks = {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
};

export const useLocomotiveActions = ({ onDelete, onStatusUpdate }: LocomotiveActionCallbacks) => {
  const tActions = useTranslations("actions");
  const tLabel = useTranslations("components.sidebar");
  const tMessages = useTranslations("messages");

  return [
    {
      label: tActions("edit"),
      element: (locomotive: Locomotive) =>
        locomotive.status !== "ARCHIVED" ? (
          <Link href={`/locomotives/${locomotive.id}/edit`} className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors">
            <span className="flex items-center gap-2">
              <Edit2Icon className="w-4 h-4 text-gray-800" />
              <span className="text-sm text-gray-800">{tActions("edit")}</span>
            </span>
          </Link>
        ) : null,
    },
    {
      label: tActions("archive"),
      element: (locomotive: Locomotive) => (
        <ActionButton
          item={{ ...locomotive, id: locomotive.id ?? 0 }}
          customConfig={{
            show: locomotive.status !== "ARCHIVED",
            title: tActions("archive"),
            description: `${tMessages("archiveConfirm")}  ${tLabel("locomotive")}  ${tMessages("commonMessage")} <b>${locomotive.name}</b>? ${tMessages("archiveWarning")}`,
            confirmText: tActions("archive"),
            buttonText: tActions("archive"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            archiveLocomotive: async (id: number) => {
              try {
                const response = await LocomotiveService.archiveLocomotive(id);
                onStatusUpdate(id, "ARCHIVED");
                toast.success(response?.message);
              } catch (error) {
                toast.error((error as any)?.data?.message);
              }
            },
          }}
        />
      ),
    },
    {
      label: tActions("activate"),
      element: (locomotive: Locomotive) => (
        <ActionButton
          item={{ ...locomotive, id: locomotive.id ?? 0 }}
          customConfig={{
            show: locomotive.status === "ARCHIVED",
            title: tActions("activate"),
            description: `${tMessages("activateConfirm")}  ${tLabel("locomotive")}  ${tMessages("commonMessage")} <b>${locomotive.name}</b>?`,
            confirmText: tActions("activate"),
            buttonText: tActions("activate"),
            variant: "default",
            icon: RefreshCw,
            style: "hover:bg-green-50 text-green-600",
          }}
          services={{
            activateLocomotive: async (id: number) => {
              try {
                const response = await LocomotiveService.activateLocomotive(id);
                onStatusUpdate(id, "ACTIVE");
                toast.success(response?.message);
              } catch (error) {
                toast.error((error as any)?.data?.message);
              }
            },
          }}
        />
      ),
    },
  ];
};

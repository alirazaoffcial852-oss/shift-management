import { Sampling } from "@/types/Sampling";
import SamplingService from "@/services/sampling";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Edit2Icon, Trash2, Eye, Plus, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { IMAGE_URL } from "@/constants/env.constants";
import Image from "next/image";

const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString();
};

const calculateNextExamination = (startDate: string | Date, frequencyDays: number): string => {
  if (!startDate || !frequencyDays) return "";

  const start = new Date(startDate);
  if (isNaN(start.getTime())) return "";

  const nextDate = new Date(start);
  nextDate.setDate(start.getDate() + frequencyDays);

  return formatDate(nextDate);
};

export const getColumns = () => {
  const t = useTranslations("common.labels");
  return [
    { header: t("lok_Name"), accessor: "locomotive.name" },
    {
      header: t("status"),
      accessor: "status",
      render: (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ""),
    },
    {
      header: t("last_Examined"),
      accessor: "sampleExamine.updated_at",
      render: (value: string | Date) => formatDate(value),
    },
    {
      header: t("next_Examined"),
      accessor: "examination_frequency",
      render: (value: number, row: Sampling) => calculateNextExamination(row.start_date, value),
    },
    {
      header: t("examine_file"),
      accessor: "sampleExamine.image_url",
      render: (imageUrl: string, row: Sampling) => {
        if (!imageUrl) {
          return (
            <div className="flex items-center justify-center h-12 w-12 bg-gray-100 rounded">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
          );
        }

        const previewUrl = IMAGE_URL + imageUrl;

        return (
          <div className="relative h-12 w-12 rounded-[32px] overflow-hidden cursor-pointer " onClick={() => window.open(previewUrl, "_blank")}>
            <Image src={previewUrl} alt="Sample Examination" fill className="object-cover rounded" />
          </div>
        );
      },
    },
  ];
};

export type SamplingActionCallbacks = {
  onDelete: (id: number) => void;
  onEdit: (id: string) => void;
  onExamine: (id: string, type: "add" | "edit") => void;
};

export const getActions = () => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");

  return [
    {
      label: tActions("edit"),
      element: (Sampling: Sampling, { onEdit }: Pick<SamplingActionCallbacks, "onEdit">) => (
        <button onClick={() => onEdit(Sampling.id?.toString() ?? "")} className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors text-left">
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-gray-800" />
            <span className="text-sm text-gray-800">{tActions("edit")}</span>
          </span>
        </button>
      ),
    },
    {
      label: "examine",
      element: (Sampling: Sampling, { onExamine }: Pick<SamplingActionCallbacks, "onExamine">) => {
        const hasExamination = Sampling.sampleExamine && Object.keys(Sampling.sampleExamine).length > 0;
        const examineType = hasExamination ? "edit" : "add";
        const examineText = hasExamination ? tActions("edit") + " " + tLabel("examine") : tActions("add") + " " + tLabel("examine");
        const ExamineIcon = hasExamination ? Eye : Plus;

        return (
          <button onClick={() => onExamine(Sampling.id?.toString() ?? "", examineType)} className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors text-left">
            <span className="flex items-center gap-2">
              <ExamineIcon className="w-4 h-4 text-gray-800" />
              <span className="text-sm text-gray-800">{examineText}</span>
            </span>
          </button>
        );
      },
    },
    {
      label: tActions("delete"),
      element: (Sampling: Sampling, { onDelete }: Pick<SamplingActionCallbacks, "onDelete">) => (
        <ActionButton
          item={{ ...Sampling, id: Sampling.id ?? 0, name: Sampling?.locomotive?.name ?? "" }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")} ${tLabel("sampling")}  ? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await SamplingService.deleteSampling(id.toString());
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
  ];
};

import { HolidayRange } from "@/types/holiday";
import HolidayService from "@/services/holiday";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Generate columns dynamically with localization
export const useHolidayColumns = () => {
  const t = useTranslations("common.labels");
  return [
    { header: t("name"), accessor: "name" },
    { header: t("from"), accessor: "from" },
    { header: t("to"), accessor: "to" },
  ];
};

export type HolidayActionCallbacks = {
  onDelete: (id: number) => void;
};

export const getHolidayActions = (callbacks: HolidayActionCallbacks) => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");

  return [
    {
      label: tActions("edit"),
      element: (holiday: HolidayRange) => (
        <Link href={`/settings/holidays/${holiday.id}/edit`} className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors">
          <span className="flex items-center gap-2 justify-center">
            <Edit2Icon className="w-4 h-4 text-gray-800" />
            <span className="text-sm text-gray-800">{tActions("edit")}</span>
          </span>
        </Link>
      ),
    },
    {
      label: tActions("delete"),
      element: (holiday: HolidayRange) => (
        <ActionButton
          item={{ ...holiday, id: holiday.id ?? 0 }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")} <b>${holiday.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "w-full h-10  text-[8px] sm:text-sm !bg-red-500 hover:bg-red-600 text-white !rounded-md text-center flex justify-center",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                let response = await HolidayService.deleteHoliday(id);
                callbacks.onDelete(id);
                toast(response?.message);
              } catch (error) {
                toast.error((error as any)?.data?.message || tMessages("error_occurred"));
                throw error;
              }
            },
          }}
        />
      ),
    },
  ];
};

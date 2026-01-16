import { TrackCostShift, TrackCostActionCallbacks } from "@/types/trackCost";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Plus, Repeat2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { format } from "date-fns";

export const useTrackCostColumns = () => {
  const t = useTranslations("pages.trackCost");

  return [
    {
      header: t("date"),
      accessor: "date",
      render: (value: string) => {
        try {
          return value ? format(new Date(value), "dd/MM/yyyy") : "-";
        } catch {
          return "-";
        }
      },
    },
    {
      header: t("startTime"),
      accessor: "start_time",
      render: (value: string) => {
        try {
          return value ? format(new Date(value), "HH:mm") : "-";
        } catch {
          return "-";
        }
      },
    },
    {
      header: t("endTime"),
      accessor: "end_time",
      render: (value: string) => {
        try {
          return value ? format(new Date(value), "HH:mm") : "-";
        } catch {
          return "-";
        }
      },
    },
    { header: t("customer"), accessor: "customer.name" },
    { header: t("product"), accessor: "product.name" },
    {
      header: t("trainNumber"),
      accessor: "shiftTrain",
      render: (value: any[], row: TrackCostShift) => {
        return row.shiftTrain?.map((train) => train.train_no).join(", ") || "-";
      },
    },
    {
      header: t("shiftStatus"),
      accessor: "status",
      render: (value: string) => {
        const statusColors = {
          FIXED: "bg-green-100 text-green-800",
          PENDING: "bg-yellow-100 text-yellow-800",
          INVOICED: "bg-blue-100 text-blue-800",
          APPROVED: "bg-purple-100 text-purple-800",
          BILLED: "bg-red-100 text-red-800",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[value as keyof typeof statusColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      header: t("costStatus"),
      accessor: "cost_status",
      render: (value: any, row: TrackCostShift) => {
        const hasCosts = row.shift_toll_cost && row.shift_toll_cost.length > 0;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              hasCosts
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {hasCosts ? t("assigned") : t("toBeAssigned")}
          </span>
        );
      },
    },
    {
      header: t("totalCost"),
      accessor: "total_cost",
      render: (value: any, row: TrackCostShift) => {
        const hasTollCost =
          row.shift_toll_cost && row.shift_toll_cost.length > 0;
        if (hasTollCost) {
          const totalCost = row.shift_toll_cost[0].total_cost;
          return totalCost ? `€${parseFloat(totalCost).toFixed(2)}` : "-";
        }

        return "-";
      },
    },
  ];
};

export const useTrackCostActions = (callbacks: TrackCostActionCallbacks) => {
  const t = useTranslations("pages.trackCost");
  const tCommon = useTranslations("common");

  return [
    {
      label: tCommon("add_edit_train_paths_cost"),
      element: (shift: TrackCostShift) => {
        const hasCosts =
          shift.shift_toll_cost && shift.shift_toll_cost.length > 0;
        const isEdit = hasCosts;
        const trackCostId = hasCosts ? shift.shift_toll_cost[0]?.id : null;
        return (
          <Link
            href={`/track-cost/${isEdit ? "edit" : "add"}/${isEdit ? trackCostId : (shift.id ?? 0)}`}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            {isEdit ? (
              <>
                <Edit className="h-4 w-4" />
                {tCommon("edit_train_paths")}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                {tCommon("add_train_paths")}
              </>
            )}
          </Link>
        );
      },
    },
    {
      label: tCommon("change_status_invoice"),
      element: (shift: TrackCostShift) => {
        return (
          <ActionButton
            item={{
              ...shift,
              id: shift.id ?? 0,
              name: shift?.customer?.name || "",
            }}
            customConfig={{
              show: shift.status !== "INVOICED",
              title: tCommon("change_status_invoice"),
              description: `${tCommon("change_status_to_invoiced")} <b>${shift.customer?.name}</b>?`,
              confirmText: tCommon("change_status"),
              buttonText: tCommon("change_status_invoice"),
              variant: "default",
              icon: Repeat2,
            }}
            services={{
              changeStatusToInvoiced: async (
                id: number,
                onClose: () => void
              ) => {
                try {
                  await callbacks.onStatusUpdate(id, "INVOICED");
                  onClose();
                } catch (error) {
                  toast.error(tCommon("failed_to_update_status"));
                  throw error;
                }
              },
            }}
          />
        );
      },
    },
  ];
};

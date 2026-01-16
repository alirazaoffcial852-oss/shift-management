import { Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Order } from "@/types/order";

type TranslationFunction = (key: string) => string;

export const getColumns = (t?: TranslationFunction) => {
  const translate = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    {
      header: translate("common.supplier_plant", "Supplier Plant"),
      accessor: "supplier_id",
      render: (_value: number, row: Order) => (
        <span className="font-medium text-gray-900">
          {row.supplier?.name ||
            row.supplier?.location ||
            `${translate("common.supplier", "Supplier")} ${row.supplier_id}`}
        </span>
      ),
    },
    {
      header: translate(
        "common.delivery_tariff_point",
        "Delivery Tariff Point"
      ),
      accessor: "tariff_id",
      render: (_value: number, row: Order) => (
        <span className="text-gray-700">
          {row.tariff?.name ||
            row.tariff?.location ||
            `${translate("common.tariff", "Tariff")} ${row.tariff_id}`}
        </span>
      ),
    },
    {
      header: translate("common.delivery_date", "Delivery Date"),
      accessor: "delivery_date",
      render: (value: string) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: translate("common.type_of_wagon", "Type of Wagon"),
      accessor: "type_of_wagon",
      render: (value: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {value}
        </span>
      ),
    },
    {
      header: translate("common.no_of_wagons", "No of Wagons"),
      accessor: "no_of_wagons",
      render: (value: number) => <span className="text-gray-700">{value}</span>,
    },
    {
      header: translate("common.tonnage", "Tonnage"),
      accessor: "tonnage",
      render: (value: number) => (
        <span className="text-gray-700">
          {value} {translate("common.tons", "Tons")}
        </span>
      ),
    },
    {
      header: translate("common.distance", "Distance"),
      accessor: "distance_in_km",
      render: (value: number) => (
        <span className="text-gray-700">
          {value} {translate("common.km", "km")}
        </span>
      ),
    },
    {
      header: translate("common.return_schedule", "Return Schedule"),
      accessor: "return_schedule",
      render: (value: string) => (
        <span className="text-gray-700">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: translate("common.labels.status", "Status"),
      accessor: "status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            value === "COMPLETED"
              ? "bg-green-100 text-green-800"
              : value === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : value === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
          }`}
        >
          {value.replace("_", " ")}
        </span>
      ),
    },
  ];
};

export type OrderActionCallbacks = {
  onDelete: (id: number) => void;
  onStatusUpdate?: (
    id: number,
    status: "OPEN" | "PENDING" | "PLANNED_COMPLETED" | "COMPLETED" | "CANCELLED"
  ) => void;
};

export const getActions = (
  callbacks?: OrderActionCallbacks,
  currentView?: string,
  t?: TranslationFunction
) => {
  const translate = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    {
      label: translate("actions.edit", "Edit"),
      element: (order: Order) => (
        <Link
          href={`/orders/${order.id}/edit?returnTo=${currentView || "table"}`}
          className="w-full block py-2 px-3 hover:bg-gray-100 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-800">
              {translate("actions.edit", "Edit")}
            </span>
          </span>
        </Link>
      ),
    },
    {
      label: translate("actions.delete", "Delete"),
      element: (order: Order) => (
        <ActionButton
          item={{
            id: order.id,
            name: `Order ${order.id}`,
          }}
          customConfig={{
            show: true,
            title: translate("common.delete_order", "Delete Order"),
            description: translate(
              "common.delete_order_description",
              "Are you sure you want to delete this order? This action cannot be undone."
            ),
            confirmText: translate("actions.delete", "Delete"),
            buttonText: translate("actions.delete", "Delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                if (callbacks?.onDelete) {
                  callbacks.onDelete(id);
                }
              } catch (error) {
                console.error("Error deleting order:", error);
                throw error;
              }
            },
          }}
        />
      ),
    },
  ];
};

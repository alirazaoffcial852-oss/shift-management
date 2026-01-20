import { Location } from "@/types/location";
import { LocationType } from "@/types/location";
import { Badge } from "@workspace/ui/components/badge";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Edit2Icon, Trash2 } from "lucide-react";
import Link from "next/link";
import { TableColumn, TableAction } from "@workspace/ui/types/smsTable";
import { useTranslations } from "next-intl";

const TypeBadge: React.FC<{ type: string; t: (key: string) => string }> = ({
  type,
  t,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case LocationType.WAREHOUSE:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case LocationType.TARIF_POINT:
        return "bg-green-100 text-green-800 border-green-200";
      case LocationType.SUPPLIER_PLANT:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case LocationType.WAREHOUSE:
        return t("warehouse");
      case LocationType.TARIF_POINT:
        return t("tariffPoint");
      case LocationType.SUPPLIER_PLANT:
        return t("supplierPlant");
      default:
        return type;
    }
  };

  return (
    <Badge
      className={`${getTypeColor(type)} border rounded-lg px-3 py-1 text-sm font-medium`}
      variant="outline"
    >
      {getTypeLabel(type)}
    </Badge>
  );
};

export const useLocationColumns = (): TableColumn[] => {
  const t = useTranslations("pages.locations");

  return [
    {
      header: t("location"),
      accessor: "location",
      className: "font-medium",
    },
    {
      header: t("locationName"),
      accessor: "name",
    },
    {
      header: t("typeOfLocation"),
      accessor: "type",
      render: (value: string) => <TypeBadge type={value} t={t} />,
    },
  ];
};

export type LocationActionCallbacks = {
  onDelete: (id: number) => void;
};

export const useLocationActions = (
  callbacks: LocationActionCallbacks
): TableAction[] => {
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");

  return [
    {
      label: tActions("edit"),
      element: (location: Location) => (
        <Link
          href={`/locations/${location.id}/edit`}
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
      element: (location: Location) => (
        <ActionButton
          item={{
            ...location,
            id: location.id ?? 0,
            name: location?.name || "",
          }}
          customConfig={{
            show: true,
            title: tActions("delete"),
            description: `${tMessages("deleteConfirm")} ${tLabel("location")} ${tMessages("commonMessage")} <b>${location.name}</b>? ${tMessages("deleteWarning")}`,
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              callbacks.onDelete(id);
            },
          }}
        />
      ),
    },
  ];
};

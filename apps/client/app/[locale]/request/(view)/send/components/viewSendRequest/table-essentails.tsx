import { Edit2Icon, Trash2 } from "lucide-react";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import RequestService from "@/services/request";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => [
  {
    header: t("companyName"),
    accessor: "name",
    render: (value: number, row: any) => row.target_company?.name || value,
  },
  {
    header: t("numberOfEmployees"),
    accessor: "no_of_employee",
  },
  {
    header: t("status"),
    accessor: "status",
    render: (value: string) => (
      <span
        className={`px-2 py-1 rounded-full text-xs lowercase ${
          value === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : value === "APPROVED"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
        }`}
      >
        {value}
      </span>
    ),
  },
  {
    header: t("note"),
    accessor: "note",
  },
  {
    header: t("createdAt"),
    accessor: "created_at",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export const COLUMNS = getColumns((key: string) => key);

type GetActionsProps = {
  onDeleteSuccess?: () => void;
  onEditClick?: (requestId: number) => void;
  t: TranslationFunction;
  tActions: TranslationFunction;
};

export const getActions = ({
  onDeleteSuccess,
  onEditClick,
  t,
  tActions,
}: GetActionsProps) => {
  return [
    {
      label: tActions("edit"),
      element: (item: any) => (
        <SMSButton
          onClick={() => onEditClick?.(item.id)}
          className="w-full block py-0 h-8 px-3 transition-colors text-left hover:bg-gray-100 text-gray-600 bg-transparent shadow-none rounded-none"
        >
          <span className="flex items-center gap-2">
            <Edit2Icon className="w-4 h-4" />
            <span className="text-sm">{tActions("edit")}</span>
          </span>
        </SMSButton>
      ),
    },
    {
      label: tActions("delete"),
      element: (item: any) => (
        <ActionButton
          item={item}
          services={{
            deleteRequest: RequestService.deleteRequest,
          }}
          onSuccess={onDeleteSuccess}
          customConfig={{
            show: true,
            title: t("deleteRequest"),
            description: t("deleteRequestDescription"),
            confirmText: tActions("delete"),
            buttonText: tActions("delete"),
            icon: Trash2,
            variant: "destructive",
            style: "hover:bg-gray-100 text-red-600",
          }}
        />
      ),
    },
  ];
};

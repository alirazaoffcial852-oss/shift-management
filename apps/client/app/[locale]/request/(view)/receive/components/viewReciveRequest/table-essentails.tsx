import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { CheckCircle, X } from "lucide-react";
import RequestService from "@/services/request";

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => [
  {
    header: t("companyName"),
    accessor: "name",
    render: (value: number, row: any) => row.requester_company?.name || value,
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

export const getActions = (t: TranslationFunction) => [
  {
    label: t("approveRequest"),
    element: (onAction?: () => void, item?: any) => (
      <button
        onClick={() => onAction?.()}
        className="w-full block py-2 px-3 hover:bg-green-50 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600">{t("approve")}</span>
        </span>
      </button>
    ),
  },
  {
    label: t("rejectRequest"),
    element: (onAction?: () => void, item?: any) => (
      <ActionButton
        item={item}
        services={{
          rejectRequest: RequestService.rejectRequest,
        }}
        onSuccess={() => {
          if (onAction) {
            onAction();
          }
        }}
        customConfig={{
          show: true,
          title: t("rejectRequest"),
          description: t("rejectRequestDescription"),
          confirmText: t("reject"),
          buttonText: t("reject"),
          icon: X,
          variant: "destructive",
          style: "hover:bg-red-50 text-red-600",
        }}
      />
    ),
  },
];

export const ACTIONS = getActions((key: string) => key);

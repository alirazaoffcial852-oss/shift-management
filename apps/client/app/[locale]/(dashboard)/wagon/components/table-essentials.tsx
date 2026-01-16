"use client";
import React from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Edit, Trash2 } from "lucide-react";
import { TableColumn, TableAction } from "@workspace/ui/types/smsTable";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { toast } from "sonner";
import WagonService from "@/services/wagon.service";

interface WagonData {
  id: number;
  wagonNumber: string;
  status:
    | "EMPTY"
    | "PLANNED_TO_BE_LOADED"
    | "SHOULD_BE_LOADED"
    | "LOADED"
    | "PLANNED_TO_BE_EMPTY"
    | "SHOULD_BE_EMPTY"
    | "DAMAGED";
  currentLocation: string;
  loadedEmptyLocation: string;
  wagonType: string;
  maxCapacity: string;
  nextRevision: string;
}

interface WagonTableProps {
  data: WagonData[];
  onEdit?: (wagon: WagonData) => void;
  onDelete?: (wagon: WagonData) => void;
  onView?: (wagon: WagonData) => void;
}

const formatWagonNumberDisplay = (value?: string | number) => {
  if (!value) return "";
  const digitsOnly = value.toString().replace(/\D/g, "");
  const parts: string[] = [];

  if (digitsOnly.length > 0) {
    parts.push(digitsOnly.slice(0, Math.min(2, digitsOnly.length)));
  }
  if (digitsOnly.length > 2) {
    parts.push(digitsOnly.slice(2, Math.min(4, digitsOnly.length)));
  }
  if (digitsOnly.length > 4) {
    parts.push(digitsOnly.slice(4, Math.min(8, digitsOnly.length)));
  }
  if (digitsOnly.length > 8) {
    parts.push(digitsOnly.slice(8, Math.min(11, digitsOnly.length)));
  }
  if (digitsOnly.length > 11) {
    parts.push(digitsOnly.slice(11, Math.min(12, digitsOnly.length)));
  }

  return parts.join(" ");
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (value: string) => {
    const s = (value || "").toUpperCase();
    if (s === "DAMAGED") return "bg-red-100 text-red-700 border-red-200";
    if (
      s.includes("LOADED") &&
      (s === "LOADED" || s.includes("PLANNED") || s.includes("SHOULD"))
    )
      return "bg-green-100 text-green-800 border-green-200";
    if (
      s.includes("EMPTY") &&
      (s === "EMPTY" || s.includes("PLANNED") || s.includes("SHOULD"))
    )
      return "bg-gray-100 text-gray-800 border-gray-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const display = (status || "").toString().replace(/_/g, " ").toLowerCase();

  return (
    <Badge
      className={`${getStatusColor(status)} border rounded-lg px-3 py-1 text-sm font-medium`}
      variant="outline"
    >
      {display}
    </Badge>
  );
};

const RevisionBadge: React.FC<{ date: string }> = ({ date }) => {
  return (
    <Badge
      className="bg-yellow-100 text-yellow-800 border-yellow-200 border rounded-lg px-3 py-1 text-sm font-medium"
      variant="outline"
    >
      {date}
    </Badge>
  );
};

type TranslationFunction = (key: string) => string;

export const getWagonTableColumns = (
  t?: TranslationFunction
): TableColumn[] => {
  const translate = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    {
      header: translate("common.wagon_no", "Wagon No"),
      accessor: "wagonNumber",
      className: "font-medium",
      render: (value: string) => formatWagonNumberDisplay(value),
    },
    {
      header: translate("common.labels.status", "Status"),
      accessor: "status",
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      header: translate("common.current_location", "Current Location"),
      accessor: "currentLocation",
    },
    {
      header: translate(
        "common.loaded_empty_location",
        "Loaded / Empty Location"
      ),
      accessor: "loadedEmptyLocation",
    },
    {
      header: translate("common.type_of_wagon", "Type of Wagon"),
      accessor: "wagonType",
    },
    {
      header: translate("common.max_capacity", "Max Capacity"),
      accessor: "maxCapacity",
    },
    {
      header: translate("common.next_revision", "Next Revision"),
      accessor: "nextRevision",
      render: (value: string) => <RevisionBadge date={value} />,
    },
  ];
};

export const getWagonTableActions = (
  onEdit?: (wagon: WagonData) => void,
  onDelete?: (wagon: WagonData) => void,
  t?: TranslationFunction,
  tActions?: TranslationFunction,
  tMessages?: TranslationFunction,
  tLabel?: TranslationFunction,
  tCommon?: TranslationFunction
): TableAction[] => {
  const translate = (key: string, fallback: string) => (t ? t(key) : fallback);
  const translateActions = (key: string, fallback: string) =>
    tActions ? tActions(key) : fallback;
  const translateMessages = (key: string, fallback: string) =>
    tMessages ? tMessages(key) : fallback;
  const translateLabel = (key: string, fallback: string) =>
    tLabel ? tLabel(key) : fallback;
  const translateCommon = (key: string, fallback: string) =>
    tCommon ? tCommon(key) : fallback;

  return [
    {
      label: "",
      element: (row: WagonData) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(row)}
          className="w-full justify-start text-gray-700 hover:text-green-600"
        >
          <Edit className="h-4 w-4 mr-2" />
          {translate("actions.edit", "Edit")}
        </Button>
      ),
    },
    {
      label: "",
      element: (row: WagonData) => {
        return (
          <ActionButton
            item={{ ...row, id: row.id, name: row.wagonNumber }}
            customConfig={{
              show: true,
              title: translateActions("delete", "Delete"),
              description: `${translateMessages("deleteConfirm", "Are you sure you want to delete")} ${translateLabel("wagon", "wagon")} ? ${translateMessages("deleteWarning", "This action cannot be undone")}`,
              confirmText: translateActions("delete", "Delete"),
              buttonText: translateActions("delete", "Delete"),
              variant: "destructive",
              icon: Trash2,
              style: "hover:bg-red-50 text-red-600",
            }}
            services={{
              deleteClient: async (id: number) => {
                try {
                  let response = await WagonService.deleteWagon(id);
                  toast.success(
                    response?.message ||
                      translateCommon(
                        "wagon_deleted_successfully",
                        "Wagon deleted successfully"
                      )
                  );
                  onDelete?.(row);
                } catch (error) {
                  toast.error(
                    (error as any)?.data?.message ||
                      translateMessages("errorOccurred", "An error occurred")
                  );
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

export const getWagonFilterOptions = (t?: TranslationFunction) => {
  const translate = (key: string, fallback: string) => (t ? t(key) : fallback);

  return [
    { value: "LOADED", label: translate("common.loaded", "loaded") },
    { value: "EMPTY", label: translate("common.empty", "empty") },
    {
      value: "PLANNED_TO_BE_LOADED",
      label: translate("common.planned_to_be_loaded", "planned to be loaded"),
    },
    {
      value: "PLANNED_TO_BE_EMPTY",
      label: translate("common.planned_to_be_empty", "planned to be empty"),
    },
    {
      value: "SHOULD_BE_LOADED",
      label: translate("common.should_be_loaded", "should be loaded"),
    },
    {
      value: "SHOULD_BE_EMPTY",
      label: translate("common.should_be_empty", "should be empty"),
    },
    { value: "DAMAGED", label: translate("common.damaged", "damaged") },
  ];
};

export type { WagonData, WagonTableProps };

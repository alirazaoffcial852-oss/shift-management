"use client";

import { TableActionsProps } from "@/types/shared/global";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Edit, Trash2, Plus, CheckCircle2, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

interface ExtendedTableActionsProps extends TableActionsProps {
  handleOpenAddDialog?: ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => void;
  handleOpenViewDetailsDialog?: ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => void;
  handleOpenCompleteDialog?: ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => void;
  handleEditAction?: ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => void;
  completeAction?: () => void;
  handleEditDocument?: ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => void;
}

const TableActions: React.FC<ExtendedTableActionsProps> = ({
  row,
  onDelete,
  handleOpenAddDialog,
  handleOpenCompleteDialog,
  completeAction,
  handleOpenViewDetailsDialog,
  handleEditAction,
  handleEditDocument,
}) => {
  const pathName = usePathname();
  const tAction = useTranslations("actions");
  const tCompleted = useTranslations("pages.maintenance");
  const isOverviewOfLocomotive = pathName.includes("overview-of-locomotive");
  const isOverViewOfActions = pathName.includes("overview-of-actions");

  const handleUploadDocument = () => {
    const dialogHandler = handleOpenCompleteDialog || handleOpenAddDialog;
    if (dialogHandler && row) {
      dialogHandler({ type: "add", id: row?.id });
    }
  };

  if (isOverviewOfLocomotive) {
    return (
      <div>
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left rounded-md transition-colors"
          onClick={() => handleOpenAddDialog?.({ type: "edit", id: row?.id })}
        >
          <Plus className="w-4 h-4" />
          <p className="text-sm">{tCompleted("AddAction")}</p>
        </button>
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left rounded-md transition-colors"
          onClick={() =>
            handleOpenViewDetailsDialog?.({ type: "edit", id: row?.id })
          }
        >
          <EyeIcon className="w-4 h-4" />
          <p className="text-sm">{tCompleted("ViewDetails")}</p>
        </button>
      </div>
    );
  }

  if (isOverViewOfActions) {
    return (
      <div className="flex flex-col w-full">
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left rounded-md transition-colors"
          onClick={() => handleEditAction?.({ type: "edit", id: row?.id })}
        >
          <Edit className="w-4 h-4" />
          <p className="text-sm">{tCompleted("EditDetails")}</p>
        </button>
        {row.state === "OFFER_OBTAINED" && (
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left rounded-md transition-colors"
            onClick={handleUploadDocument}
          >
            <Plus className="w-4 h-4" />
            <p className="text-sm">{tCompleted("Document")}</p>
          </button>
        )}
        {row.state !== "OFFER_OBTAINED" && (
          <button
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left rounded-md transition-colors"
            onClick={() => handleEditDocument?.({ type: "edit", id: row?.id })}
          >
            <Edit className="w-4 h-4" />
            <p className="text-sm">{tCompleted("EditDocument")}</p>
          </button>
        )}
        {row.state === "IN_PROCESS" && (
          <ActionButton
            item={{ ...row, id: row.id ?? 0 }}
            customConfig={{
              show: true,
              title: tCompleted("completeAction"),
              description: tCompleted("completeActionDescription"),
              confirmText: tCompleted("complete"),
              buttonText: tCompleted("Completed"),
              variant: "default",
              icon: CheckCircle2,
              style: "hover:bg-gray-50 text-gray-700",
            }}
            services={{
              completeClient: async (id: number) => {
                try {
                  await completeAction?.();
                } catch (error) {
                  toast.error(tCompleted("failedToCompleteAction"));
                }
              },
            }}
          />
        )}
        <ActionButton
          item={{ ...row, id: row.id ?? 0 }}
          customConfig={{
            show: true,
            title: tCompleted("deleteAction"),
            description: tCompleted("deleteActionDescription"),
            confirmText: tCompleted("delete"),
            buttonText: tAction("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                await onDelete?.(row);
                toast.success(tCompleted("actionDeletedSuccessfully"));
              } catch (error) {
                toast.error(
                  (error as any)?.data?.message ||
                    tCompleted("failedToDeleteAction")
                );
              }
            },
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left rounded-md transition-colors"
          onClick={() => handleOpenAddDialog?.({ type: "edit", id: row?.id })}
        >
          <Edit className="w-4 h-4" />
          {tAction("edit")}
        </button>
        <ActionButton
          item={{ ...row, id: row.id ?? 0 }}
          customConfig={{
            show: true,
            title: tCompleted("deleteAction"),
            description: tCompleted("deleteActionDescriptionAlt"),
            confirmText: tCompleted("delete"),
            buttonText: tAction("delete"),
            variant: "destructive",
            icon: Trash2,
            style: "hover:bg-red-50 text-red-600",
          }}
          services={{
            deleteClient: async (id: number) => {
              try {
                await onDelete?.(row);
              } catch (error) {
                toast.error(
                  (error as any)?.data?.message ||
                    tCompleted("failedToDeleteAction")
                );
              }
            },
          }}
        />
      </div>
    </>
  );
};

export default TableActions;

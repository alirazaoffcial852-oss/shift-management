"use client";
import React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { Plus } from "lucide-react";
import { Customer } from "@/types/customer";
import { useTranslations } from "next-intl";
import {
  getActions,
  getColumns,
  typeOfoperationActionCallbacks,
} from "./table-essentails";
import { useTypeOfOperationTable } from "@/hooks/typeOfOperation/useTypeOfOperationTable";
import { usePermission } from "@/hooks/usePermission";

const TypeOfOperation = () => {
  const router = useRouter();
  const t = useTranslations("components.sidebar");
  const tSettings = useTranslations("pages.settings");
  const { hasPermission } = usePermission();
  const {
    typeOfOperations,
    pagination,
    removeTypeOfOperation,
    fetchTypeOfOperations,
  } = useTypeOfOperationTable();

  const actionCallbacks: typeOfoperationActionCallbacks = {
    onDelete: removeTypeOfOperation,
  };
  const allActions = getActions();
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("settings.operation-type");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("settings.operation-type");
    }
    return true;
  });
  const actionsWithCallbacks = actions.map((action) => ({
    ...action,
    element: (customer: Customer) => {
      if (customer.id !== undefined) {
        return action.element(customer as Required<Customer>, actionCallbacks);
      }
      return null;
    },
  }));

  const columns = getColumns();

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center ">
        <h2>{t("type_of_operations")}</h2>
        {hasPermission("settings.operation-type") && (
          <SMSButton
            text={tSettings("addTypeOfOperation")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/settings/type-of-operation/add")}
          />
        )}
      </div>

      <SMSTable
        columns={columns}
        data={typeOfOperations}
        actions={actionsWithCallbacks}
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        onPageChange={fetchTypeOfOperations}
        dateTimeFilter={true}
      />
    </div>
  );
};

export default TypeOfOperation;

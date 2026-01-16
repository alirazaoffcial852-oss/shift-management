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
  costCenterActionCallbacks,
  getActions,
  getColumns,
} from "./table-essentails";
import { useCostCenterTable } from "@/hooks/costCenter/useCostCenterTable";
import { usePermission } from "@/hooks/usePermission";

const CostCenter = () => {
  const router = useRouter();
  const t = useTranslations("components.sidebar");
  const tSettings = useTranslations("pages.settings");
  const { hasPermission } = usePermission();
  const { costCenters, pagination, removeCostCenter, fetchCostCenters } =
    useCostCenterTable();

  const actionCallbacks: costCenterActionCallbacks = {
    onDelete: removeCostCenter,
  };
  const allActions = getActions();
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("settings.cost-center");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("settings.cost-center");
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
        <h2>{t("cost_centers")}</h2>
        {hasPermission("settings.cost-center") && (
          <SMSButton
            text={tSettings("addCostCenter")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/settings/cost-center/add")}
          />
        )}
      </div>

      <SMSTable
        columns={columns}
        data={costCenters}
        actions={actionsWithCallbacks}
        currentPage={pagination.page}
        totalPages={pagination.total_pages}
        onPageChange={fetchCostCenters}
        dateTimeFilter={true}
      />
    </div>
  );
};

export default CostCenter;

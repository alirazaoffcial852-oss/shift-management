"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import Tabs from "@/components/Tabs";
import { Plus } from "lucide-react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useEmployeeTable } from "@/hooks/employee/useEmployeeTable";
import {
  EmployeeActionCallbacks,
  useEmployeeActions,
  useEmployeeColumns,
} from "./table-essentails";
import { OPTIONS } from "@/constants/tabsOption.constant";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

const ViewEmployee = () => {
  const router = useRouter();
  const {
    employees,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    removeEmployee,
    updateEmployeeStatus,
    tabValue,
    setTabValue,
  } = useEmployeeTable();
  const { hasPermission } = usePermission();

  const columns = useEmployeeColumns();

  const actionCallbacks: EmployeeActionCallbacks = {
    onDelete: removeEmployee,
    onStatusUpdate: updateEmployeeStatus,
  };

  const allActions = useEmployeeActions(actionCallbacks);
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("employee.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("employee.delete");
    }
    return true;
  });

  const taction = useTranslations("actions");
  const tEmployees = useTranslations("pages.employees");
  const tsidebar = useTranslations("components.sidebar");

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center ">
        <h2>{tsidebar("employees")}</h2>
        {hasPermission("employee.create") && (
          <SMSButton
            text={taction("add") + " " + tsidebar("employee")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/employees/add")}
          />
        )}
      </div>

      <Tabs
        options={[...OPTIONS.tabs]}
        value={tabValue}
        onChange={setTabValue}
      />

      <SMSTable
        columns={columns}
        data={employees}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
        actionsHeader={tEmployees("actions")}
      />
    </div>
  );
};

export default ViewEmployee;

"use client";
import React from "react";
import { getActions, getColumns } from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useRouter } from "next/navigation";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import { Plus } from "lucide-react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useStaffTable } from "@/hooks/staff/useStaffTable";
import { Staff } from "@/types/staff";
import { OPTIONS } from "@/constants/tabsOption.constant";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

const Viewstaff = () => {
  const router = useRouter();

  const {
    staff,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    removeStaff,
    tabValue,
    setTabValue,
    updateStaffStatus,
    isLoading,
  } = useStaffTable();

  const columns = getColumns();
  const { hasPermission } = usePermission();

  const allActions = getActions();
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("staff.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("staff.delete");
    }
    return true;
  });

  const taction = useTranslations("actions");
  const tStaff = useTranslations("pages.staff");
  const tsidebar = useTranslations("components.sidebar");

  const actionsWithCallbacks = actions.map((action) => ({
    ...action,
    element: (staff: Staff) =>
      action.element(staff, {
        onDelete: (id: number) => {
          if (id !== undefined) {
            removeStaff(id);
          }
        },
        onStatusUpdate: updateStaffStatus,
      }),
  }));

  return (
    <>
      <div className="space-y-4 px-0 lg:px-[30px]">
        <div className="flex justify-between items-center ">
          <h2>{tsidebar("staff")}</h2>
          {hasPermission("staff.create") && (
            <SMSButton
              text={taction("add") + " " + tsidebar("staff")}
              startIcon={<Plus className="h-4 w-4" />}
              className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
              onClick={() => router.push("/staff/add")}
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
          data={staff}
          actions={actionsWithCallbacks}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onTimeFilterChange={handleTimeFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onSearchChange={handleSearch}
          search
          pagination
          actionsHeader={tStaff("actions")}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default Viewstaff;

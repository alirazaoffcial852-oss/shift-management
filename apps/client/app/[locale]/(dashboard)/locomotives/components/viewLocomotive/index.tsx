"use client";
import React from "react";
import { useLocomotiveActions, useLocomotiveColumns } from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { useTranslations } from "next-intl";
import Tabs from "@/components/Tabs";
import { OPTIONS } from "@/constants/tabsOption.constant";
import PermissionGuard from "@/components/PermissionGuard";

const ViewLocomotive = () => {
  const router = useRouter();
  const {
    locomotives,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    archiveLocomotive,
    deleteLocomotive,
    tabValue,
    setTabValue,
    updateLocomotiveStatus,
    isLoading,
  } = useLocomotiveTable();

  const columns = useLocomotiveColumns();

  const actions = useLocomotiveActions({
    onDelete: deleteLocomotive,
    onStatusUpdate: updateLocomotiveStatus,
    onArchive: archiveLocomotive,
  });

  const taction = useTranslations("actions");
  const tLocomotives = useTranslations("pages.locomotives");
  const tsidebar = useTranslations("components.sidebar");

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center">
        <h2>{tsidebar("locomotives")}</h2>

        <PermissionGuard permissionRequired="locomotive.create">
          <SMSButton
            text={taction("add") + " " + tsidebar("locomotives")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/locomotives/add")}
          />
        </PermissionGuard>
      </div>

      <Tabs
        options={[...OPTIONS.tabs]}
        value={tabValue}
        onChange={setTabValue}
      />

      <SMSTable
        columns={columns}
        data={locomotives}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
        dateTimeFilter={true}
        search
        pagination
        actionsHeader={tLocomotives("actions")}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ViewLocomotive;

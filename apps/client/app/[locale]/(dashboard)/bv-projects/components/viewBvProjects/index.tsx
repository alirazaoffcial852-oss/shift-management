"use client";

import React from "react";
import {
  BvProjectActionCallbacks,
  getActions,
  getColumns,
} from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import Tabs from "@/components/Tabs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { OPTIONS } from "@/constants/tabsOption.constant";
import { useBvProjectTable } from "@/hooks/bvProject/useBvProjectTable";
import { BvProject } from "@/types/bvProject";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";
const ViewBvProjects = () => {
  const router = useRouter();

  const {
    bvProjects,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    updateBvProjectStatus,
    removeBvProject,
    tabValue,
    setTabValue,
    isLoading,
  } = useBvProjectTable();

  const columns = getColumns();
  const { hasPermission } = usePermission();

  const allActions = getActions();
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("bv-project.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("bv-project.delete");
    }
    return true;
  });

  const taction = useTranslations("actions");
  const tBvProjects = useTranslations("pages.bvProjects");
  const tsidebar = useTranslations("components.sidebar");

  const actionCallbacks: BvProjectActionCallbacks = {
    onDelete: removeBvProject,
    onStatusUpdate: updateBvProjectStatus,
  };

  const actionsWithCallbacks = actions.map((action) => ({
    ...action,
    element: (bvProject: BvProject) =>
      action.element(bvProject, actionCallbacks),
  }));

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold">{tsidebar("bvProject")}</h2>
        {hasPermission("bv-project.create") && (
          <SMSButton
            text={taction("add") + " " + tsidebar("bvProject")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/bv-projects/add")}
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
        data={bvProjects}
        actions={actionsWithCallbacks}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
        search={true}
        actionsHeader={tBvProjects("actions")}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ViewBvProjects;

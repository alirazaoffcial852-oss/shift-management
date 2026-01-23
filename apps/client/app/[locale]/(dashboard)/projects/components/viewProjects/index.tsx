"use client";

import React from "react";
import {
  getActions,
  getColumns,
  ProjectActionCallbacks,
} from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import Tabs from "@/components/Tabs";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { OPTIONS } from "@/constants/tabsOption.constant";
import { projectData } from "@/constants";
import { useProjectTable } from "@/hooks/project/useProjectTable";
import { Project } from "@/types/project";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";
const ViewProjects = () => {
  const router = useRouter();

  const {
    projects,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    updateProjectStatus,
    removeProject,
    tabValue,
    setTabValue,
    isLoading,
  } = useProjectTable();

  const columns = getColumns();
  const { hasPermission } = usePermission();

  const allActions = getActions();
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("project.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("project.delete");
    }
    return true;
  });

  const taction = useTranslations("actions");
  const tProjects = useTranslations("pages.projects");
  const tsidebar = useTranslations("components.sidebar");

  const actionCallbacks: ProjectActionCallbacks = {
    onDelete: removeProject,
    onStatusUpdate: updateProjectStatus,
  };
  const actionsWithCallbacks = actions.map((action) => ({
    ...action,
    element: (project: Project) => action.element(project, actionCallbacks),
  }));

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold">{tsidebar("project")}</h2>
        {hasPermission("project.create") && (
          <SMSButton
            text={taction("add") + " " + tsidebar("project")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/projects/add")}
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
        data={projects}
        actions={actionsWithCallbacks}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
        search={true}
        actionsHeader={tProjects("actions")}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ViewProjects;

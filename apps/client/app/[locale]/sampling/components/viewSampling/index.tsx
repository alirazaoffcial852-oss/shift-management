"use client";

import React, { useState } from "react";
import {
  getActions,
  getColumns,
  SamplingActionCallbacks,
} from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { SampleExamine, Sampling } from "@/types/Sampling";
import { useSamplingTable } from "@/hooks/sampling/useSamplingTable";
import SamplingDialog from "../SamplingDialog";
import SampleExamineDialog from "../SampleExamineDialog";
import { usePermission } from "@/hooks/usePermission";

const ViewSampling = () => {
  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    type: "add" as "add" | "edit",
    id: undefined as string | undefined,
  });
  const [examineDialogConfig, setExamineDialogConfig] = useState({
    isOpen: false,
    type: "add" as "add" | "edit",
    id: undefined as string | undefined,
  });

  const {
    samplings,
    setSamplings,
    currentPage,
    totalPages,
    onPageChange,
    handleSearch,
    removeSampling,
    tabValue,
    setTabValue,
  } = useSamplingTable();

  const columns = getColumns();
  const actions = getActions();
  const taction = useTranslations("actions");
  const tsidebar = useTranslations("components.sidebar");
  const { hasPermission } = usePermission();

  const handleOpenEditDialog = (id: string) => {
    setDialogConfig({
      isOpen: true,
      type: "edit",
      id,
    });
  };

  const handleOpenExamineDialog = (id: string, type: "add" | "edit") => {
    console.log(id, "kjsdhfjkhsj");
    setExamineDialogConfig({
      isOpen: true,
      type,
      id,
    });
  };

  const actionCallbacks: SamplingActionCallbacks = {
    onDelete: removeSampling,
    onEdit: handleOpenEditDialog,
    onExamine: handleOpenExamineDialog,
  };

  const actionsWithCallbacks = actions.map((action) => ({
    ...action,
    element: (sampling: Sampling) => action.element(sampling, actionCallbacks),
  }));

  const handleOpenAddDialog = () => {
    setDialogConfig({
      isOpen: true,
      type: "add",
      id: undefined,
    });
  };

  const handleCloseDialog = (data: Sampling[] | Sampling) => {
    setDialogConfig((prev) => ({
      ...prev,
      isOpen: false,
      id: "",
    }));

    const newSamples = Array.isArray(data) ? data : [data];

    if (dialogConfig.id) {
      setSamplings((prev) =>
        prev.map((s) => {
          const updated = newSamples.find((ns) => ns.id === s.id);
          return updated ? updated : s;
        })
      );
    } else {
      setSamplings((prev) => [...prev, ...newSamples]);
    }
  };

  const handleCloseExamineDialog = (data: SampleExamine) => {
    setExamineDialogConfig((prev) => ({
      ...prev,
      isOpen: false,
      id: undefined,
    }));

    if (examineDialogConfig.id) {
      setSamplings((prev) =>
        prev.map((s) => {
          if (s.id?.toString() === examineDialogConfig.id) {
            return {
              ...s,
              sampleExamine: data,
            };
          }
          return s;
        })
      );
    }
  };

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center ">
        <h2 className="text-2xl font-bold">{tsidebar("sampling")}</h2>
        {hasPermission("sample.create") && (
          <SMSButton
            text={taction("add") + " " + tsidebar("sampling")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={handleOpenAddDialog}
          />
        )}
      </div>

      <SMSTable
        columns={columns}
        data={samplings}
        actions={actionsWithCallbacks}
        actionsHeader={taction("action")}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onSearchChange={handleSearch}
        search={true}
        pagination={true}
      />

      <SamplingDialog
        isOpen={dialogConfig.isOpen}
        onOpenChange={(open) =>
          setDialogConfig((prev) => ({ ...prev, isOpen: open }))
        }
        onClose={handleCloseDialog}
        type={dialogConfig.type}
        id={dialogConfig.id}
      />
      <SampleExamineDialog
        isOpen={examineDialogConfig.isOpen}
        onOpenChange={(open) =>
          setExamineDialogConfig((prev) => ({ ...prev, isOpen: open }))
        }
        onClose={handleCloseExamineDialog}
        type={examineDialogConfig.type}
        id={examineDialogConfig.id}
      />
    </div>
  );
};

export default ViewSampling;

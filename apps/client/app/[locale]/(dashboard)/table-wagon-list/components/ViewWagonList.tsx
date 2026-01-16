"use client";
import React from "react";
import { getActions, getColumns } from "./table-essentials";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useWagonListForm } from "@/hooks/wagonList/useWagonListForm";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const ViewWagonList = () => {
  const {
    wagons,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
  } = useWagonListForm();

  const t = useTranslations();
  const tWagonList = useTranslations("pages.wagonList");
  const tPdf = useTranslations("pdf");
  const columns = getColumns(t);
  const actions = getActions(t, tPdf);

  return (
    <div className="space-y-4 px-0 lg:px-[30px] mt-20">
      <div className="flex justify-between items-center">
        <h2>{t("components.sidebar.WagonList")}</h2>
      </div>
      <SMSTable
        columns={columns}
        data={wagons}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onTimeFilterChange={handleTimeFilterChange}
        onDateRangeChange={handleDateRangeChange}
        onSearchChange={handleSearch}
        actionsHeader={tWagonList("actions")}
      />
    </div>
  );
};

export default ViewWagonList;

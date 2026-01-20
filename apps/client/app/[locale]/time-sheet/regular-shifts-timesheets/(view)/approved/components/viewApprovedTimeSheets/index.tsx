"use client";
import React from "react";
import { ACTIONS, getColumns } from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useTimeSheetTable } from "@/hooks/timeSheet/useTimeSheetTable";
import { useTranslations } from "next-intl";
const ViewApprovedTimeSheet = () => {
  const t = useTranslations("timesheet");
  const { timeSheets, currentPage, totalPages, onPageChange, handleSearch } =
    useTimeSheetTable();
    
  return (
    <SMSTable
      columns={getColumns(t)}
      data={timeSheets}
      actions={ACTIONS}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onSearchChange={handleSearch}
    />
  );
};

export default ViewApprovedTimeSheet;

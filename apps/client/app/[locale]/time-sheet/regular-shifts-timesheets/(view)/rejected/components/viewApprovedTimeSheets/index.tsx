"use client";
import React from "react";
import { ACTIONS, getColumns } from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useTimeSheetTable } from "@/hooks/timeSheet/useTimeSheetTable";
import { Timesheet } from "@/types/timeSheet";
import { useTranslations } from "next-intl";
const ViewRejectedTimeSheet = () => {
  const t = useTranslations("timesheet");
  const { timeSheets, currentPage, totalPages, setCurrentPage, handleSearch } =
    useTimeSheetTable();

  return (
    <SMSTable
      columns={getColumns(t)}
      data={timeSheets}
      actions={ACTIONS}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onSearchChange={handleSearch}
    />
  );
};

export default ViewRejectedTimeSheet;

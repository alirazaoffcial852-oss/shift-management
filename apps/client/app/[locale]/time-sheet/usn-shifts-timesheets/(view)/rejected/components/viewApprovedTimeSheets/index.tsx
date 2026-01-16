"use client";
import React from "react";
import { getColumns, ACTIONS } from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useUSTimeSheetTable } from "@/hooks/timeSheet/useUSTTimeSheetTable";
import { useTranslations } from "next-intl";

const ViewRejectedUSTimeSheet = () => {
  const t = useTranslations("timesheet");
  const { timeSheets, currentPage, totalPages, setCurrentPage, handleSearch } =
    useUSTimeSheetTable();

  return (
    <div className="space-y-4">
      <SMSTable
        columns={getColumns(t)}
        data={timeSheets}
        actions={ACTIONS}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
      />
    </div>
  );
};

export default ViewRejectedUSTimeSheet;

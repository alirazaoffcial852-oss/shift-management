"use client";
import React, { useState } from "react";
import { getColumns, ACTIONS } from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useUSTimeSheetTable } from "@/hooks/timeSheet/useUSTTimeSheetTable";
import { BulkSubmitButton } from "../../../draft/components/viewApprovedTimeSheets/table-essentails";
import { useTranslations } from "next-intl";

const ViewApprovedUSTimeSheet = () => {
  const [selectedTimeSheets, setSelectedTimeSheets] = useState<number[]>([]);
  const t = useTranslations("timesheet");
  const {
    timeSheets,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    updateTimeSheetStatus,
  } = useUSTimeSheetTable();

  console.log(timeSheets, "USN timeSheets");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {selectedTimeSheets.length > 0 && (
          <BulkSubmitButton
            selectedIds={selectedTimeSheets}
            onSubmitSuccess={() => {
              setSelectedTimeSheets([]);
              updateTimeSheetStatus(selectedTimeSheets);
            }}
          />
        )}
      </div>

      <SMSTable
        columns={getColumns(t)}
        data={timeSheets}
        actions={ACTIONS}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
        enableSelection={true}
        selectedRows={selectedTimeSheets}
        onSelectionChange={setSelectedTimeSheets}
      />
    </div>
  );
};

export default ViewApprovedUSTimeSheet;

"use client";
import React, { useState } from "react";
import { getColumns, BulkSubmitButton, ACTIONS } from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useTimeSheetTable } from "@/hooks/timeSheet/useTimeSheetTable";
import { Timesheet } from "@/types/timeSheet";
import { useTranslations } from "next-intl";

const ViewApprovedTimeSheet = () => {
  const [selectedTimeSheets, setSelectedTimeSheets] = useState<number[]>([]);
  const t = useTranslations("timesheet");
  const {
    timeSheets,
    currentPage,
    totalPages,
    handleSearch,
    updateTimeSheetStatus,
    onPageChange
  } = useTimeSheetTable();

  console.log(timeSheets, "timeSheets");

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
        onPageChange={onPageChange}
        onSearchChange={handleSearch}
        enableSelection={true}
        selectedRows={selectedTimeSheets}
        onSelectionChange={setSelectedTimeSheets}
      />
    </div>
  );
};

export default ViewApprovedTimeSheet;

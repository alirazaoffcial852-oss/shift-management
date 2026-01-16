"use client";
import React, { useState } from "react";
import {
  getColumns,
  BulkApproveButton,
  BulkRejectButton,
} from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useUSTimeSheetTable } from "@/hooks/timeSheet/useUSTTimeSheetTable";
import { useAuth } from "@/providers/appProvider";
import { useTranslations } from "next-intl";

const ViewSubmittedUSTimeSheet = () => {
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
  const { isEmployee } = useAuth();

  console.log(timeSheets, "USN timeSheets");

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        {!isEmployee && selectedTimeSheets.length > 0 && (
          <>
            <BulkApproveButton
              selectedIds={selectedTimeSheets}
              onSuccess={() => {
                setSelectedTimeSheets([]);
                updateTimeSheetStatus(selectedTimeSheets);
              }}
            />
            <BulkRejectButton
              selectedIds={selectedTimeSheets}
              onSuccess={() => {
                setSelectedTimeSheets([]);
                updateTimeSheetStatus(selectedTimeSheets);
              }}
            />
          </>
        )}
      </div>

      <SMSTable
        columns={getColumns(t)}
        data={timeSheets}
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

export default ViewSubmittedUSTimeSheet;

// components/track-cost/index.tsx
"use client";
import React from "react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useTrackCostActions, useTrackCostColumns } from "./table-essentails";
import { useTrackCostTable } from "@/hooks/trackCost/useTrackCost";
import { useTranslations } from "next-intl";

const ViewTrackCost = () => {
  const {
    trackCostShifts,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    updateShiftStatus,
    isLoading,
  } = useTrackCostTable();

  const columns = useTrackCostColumns();

  const actionCallbacks = {
    onStatusUpdate: updateShiftStatus,
  };

  const actions = useTrackCostActions(actionCallbacks);

  const tTrackCost = useTranslations("pages.trackCost");

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <SMSTable
        columns={columns}
        data={trackCostShifts}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
        search={true}
        isLoading={isLoading}
        className="min-w-full"
        dateTimeFilter={false}
        actionsHeader={tTrackCost("actions")}
      />
    </div>
  );
};

export default ViewTrackCost;

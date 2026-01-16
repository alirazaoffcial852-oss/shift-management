"use client";
import React, { useState } from "react";
import { getActions, getColumns } from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import ReceiveRequestDialog from "./ReceiveRequestDialog";
import { useReceiveRequestForm } from "@/hooks/receiveRequest/useReceiveRequestHook";
import { useTranslations } from "next-intl";

const ViewReceiveRequest = () => {
  const t = useTranslations("pages.request");
  const {
    receiveRequest,
    pagination,
    loadRecevieRequests,
    handlePageChange,
    handleStatusFilter,
  } = useReceiveRequestForm();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const statusFilterOptions = [
    { value: "PENDING", label: t("pending") },
    { value: "APPROVED", label: t("approved") },
    { value: "REJECTED", label: t("rejected") },
  ];

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleAction = (request: any, action: "APPROVE" | "REJECT") => {
    setSelectedRequest(request);
    setActionType(action);
    if (action === "APPROVE") {
      setIsDialogOpen(true);
    }
    loadRecevieRequests();
  };

  const handleSuccess = () => {
    loadRecevieRequests();
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Search term:", searchTerm);
  };

  const handleFilter = (filterValue: string) => {
    setSelectedFilter(filterValue);
    handleStatusFilter(filterValue as any);
  };

  const actions = getActions(t);
  const actionsWithHandlers = actions.map((action) => ({
    ...action,
    element: (request: any) => {
      if (action.label === t("approveRequest")) {
        return action.element(() => handleAction(request, "APPROVE"), request);
      }
      if (action.label === t("rejectRequest")) {
        return action.element(() => handleAction(request, "REJECT"), request);
      }
      return action.element();
    },
  }));

  return (
    <div className="space-y-4 px-0">
      <div className="mt-16">
        <SMSTable
          columns={getColumns(t)}
          data={receiveRequest}
          actions={actionsWithHandlers}
          actionsHeader={t("action")}
          currentPage={pagination?.page || 1}
          totalPages={pagination?.total_pages || 1}
          onPageChange={handlePageChange}
          onSearchChange={handleSearch}
          pagination={true}
          search={true}
          showFilter={true}
          filterOptions={statusFilterOptions}
          filterLabel={t("status")}
          selectedFilterValue={selectedFilter}
          onFilterChange={handleFilter}
        />
      </div>
      {isDialogOpen && (
        <ReceiveRequestDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onClose={handleDialogClose}
          request={selectedRequest}
          actionType={actionType}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default ViewReceiveRequest;

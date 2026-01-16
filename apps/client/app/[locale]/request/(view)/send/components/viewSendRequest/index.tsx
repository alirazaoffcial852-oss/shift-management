"use client";
import React, { useState } from "react";
import { getColumns, getActions } from "./table-essentails";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useTranslations } from "next-intl";
import Image from "next/image";
import SendRequestDialog from "../SendRequestDialog";
import { useSendRequestForm } from "@/hooks/sendRequest/useSendRequestHook";
import { useCompany } from "@/providers/appProvider";
import { SendRequest } from "@/types/request";

const ViewSendRequest = () => {
  const tActions = useTranslations("actions");
  const t = useTranslations("pages.request");
  const { sendRequests, pagination, loadSendRequests, handleStatusFilter } =
    useSendRequestForm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "edit">("add");
  const [editingRequestId, setEditingRequestId] = useState<
    string | undefined
  >();
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const statusFilterOptions = [
    { value: "PENDING", label: t("pending") },
    { value: "APPROVED", label: t("approved") },
    { value: "REJECTED", label: t("rejected") },
  ];
  const { company } = useCompany();

  const handleDialogClose = (request?: SendRequest) => {
    if (request && company?.id) {
      loadSendRequests(company.id, pagination.page, pagination.limit);
    }
    setIsDialogOpen(false);
    setDialogType("add");
    setEditingRequestId(undefined);
  };

  const handleSendRequestClick = () => {
    setDialogType("add");
    setEditingRequestId(undefined);
    setIsDialogOpen(true);
  };

  const handleEditClick = (requestId: number) => {
    setDialogType("edit");
    setEditingRequestId(requestId.toString());
    setIsDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (company?.id) {
      loadSendRequests(company.id, page, pagination.limit);
    }
  };

  const handleSearch = (searchTerm: string) => {
    console.log("Search term:", searchTerm);
  };

  const handleDeleteSuccess = () => {
    if (company?.id) {
      loadSendRequests(company.id, pagination.page, pagination.limit);
    }
  };

  const actions = getActions({
    onDeleteSuccess: handleDeleteSuccess,
    onEditClick: handleEditClick,
    t,
    tActions,
  });

  const handleFilter = (filterValue: string) => {
    setSelectedFilter(filterValue);
    handleStatusFilter(filterValue as any);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-end">
        <SMSButton
          text={tActions("send") + " " + tActions("request")}
          startIcon={
            <Image
              src="/images/projects.svg"
              alt="Add Bv Project"
              width={16}
              height={16}
              className="text-white"
            />
          }
          className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
          onClick={handleSendRequestClick}
        />
      </div>
      <SMSTable
        columns={getColumns(t)}
        data={sendRequests}
        actions={actions}
        actionsHeader={t("action")}
        currentPage={pagination?.page || 1}
        totalPages={pagination?.total_pages || 1}
        onPageChange={handlePageChange}
        onSearchChange={handleSearch}
        pagination={true}
        showFilter={true}
        search={true}
        filterOptions={statusFilterOptions}
        filterLabel={t("status")}
        selectedFilterValue={selectedFilter}
        onFilterChange={handleFilter}
      />

      <SendRequestDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onClose={handleDialogClose}
        type={dialogType}
        id={editingRequestId}
      />
    </div>
  );
};

export default ViewSendRequest;

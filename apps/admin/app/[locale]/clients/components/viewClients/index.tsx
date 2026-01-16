"use client";
import React from "react";
import { ACTIONS, COLUMNS } from "./table-essentails";
import Image from "next/image";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useRouter } from "next/navigation";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useClientTable } from "@/hooks/useClientTable";
import { Client } from "@workspace/ui/types/client";

const ViewClient = () => {
  const router = useRouter();
  const {
    clients,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    removeClient,
    updateClientStatus,
  } = useClientTable();

  const actionsWithCallbacks = ACTIONS.map((action) => ({
    ...action,
    element: (client: Client) =>
      action.element(client, {
        onDelete: removeClient,
        onStatusUpdate: updateClientStatus,
      }),
  }));

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center">
        <h2>Clients</h2>
        <SMSButton
          text="Add Client"
          startIcon={
            <Image
              src="/images/clientActive.svg"
              alt="Add Client"
              width={16}
              height={16}
              className="text-white"
            />
          }
          className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
          onClick={() => router.push("/clients/add")}
        />
      </div>

      <SMSTable
        columns={COLUMNS}
        data={clients}
        actions={actionsWithCallbacks}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onTimeFilterChange={handleTimeFilterChange}
        onDateRangeChange={handleDateRangeChange}
        onSearchChange={handleSearch}
        dateTimeFilter={true}
      />
    </div>
  );
};

export default ViewClient;

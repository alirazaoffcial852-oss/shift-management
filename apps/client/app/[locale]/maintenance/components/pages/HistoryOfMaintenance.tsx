"use client";

import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useHistoryOfMaintenanceTable } from "@/hooks/historyOfMaintenance/useHistoryOfMaintenance";
import { FileText, FileType2, File } from "lucide-react";
import { IMAGE_URL } from "@/constants/env.constants";

const isImageFile = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
    ext ?? ""
  );
};

const getFileTypeIcon = (extension: string) => {
  switch (extension) {
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />;
    case "doc":
    case "docx":
      return <FileType2 className="h-6 w-6 text-blue-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
};

const HistoryOfMaintenance: React.FC = () => {
  const {
    historyOfMaintenanceData,
    showPagination,
    totalPages,
    handleSearchChange,
    handleDateRangeChange,
    isLoading,
    handlePageChange,
    currentPage,
  } = useHistoryOfMaintenanceTable();

  const t = useTranslations("pages.maintenance");

  const columns = [
    {
      header: t("actionName"),
      accessor: "actionName",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: t("documents"),
      accessor: "documents",
      className: "font-semibold",
      headerClassName: "text-gray-500",
      render: (documents: string[]) => (
        <div className="flex flex-wrap gap-2">
          {documents?.map((fileUrl: string, index: number) => {
            const ext = fileUrl.split(".").pop()?.toLowerCase() || "";
            const isImage = isImageFile(fileUrl);
            const fullUrl =
              IMAGE_URL +
              (fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl);

            return isImage ? (
              <img
                key={index}
                src={fullUrl}
                alt="Preview"
                className="w-16 h-16 object-cover rounded border"
              />
            ) : (
              <a
                key={index}
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 border rounded"
              >
                {getFileTypeIcon(ext)}
              </a>
            );
          })}
        </div>
      ),
    },
    {
      header: t("notes"),
      accessor: "notes",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: t("completionDate"),
      accessor: "completionDate",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t("historyOfMaintenance")}</h2>
      <SMSTable
        onDateRangeChange={handleDateRangeChange}
        onSearchChange={handleSearchChange}
        columns={columns}
        data={historyOfMaintenanceData}
        onPageChange={handlePageChange}
        pagination={true}
        search={true}
        currentPage={showPagination ? currentPage : 1}
        totalPages={showPagination ? totalPages : 1}
        isLoading={isLoading}
        enableSelection={false}
        className="w-full overflow-x-auto mt-6 border-separate border-spacing-y-3"
      />
    </div>
  );
};

export default HistoryOfMaintenance;

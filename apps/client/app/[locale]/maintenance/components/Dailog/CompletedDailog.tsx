"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useHistoryOfMaintenanceTable } from "@/hooks/historyOfMaintenance/useHistoryOfMaintenance";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
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
  const [currentPage, setCurrentPage] = useState(1);
  const { historyOfMaintenanceData = [] } = useHistoryOfMaintenanceTable();
  const t = useTranslations("pages.maintenance");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    console.log("Page changed to:", page);
  };

  const columns = [
    {
      header: "Action Name",
      accessor: "actionName",
      className: "font-semibold text-gray-900",
    },
    {
      header: "Documents",
      accessor: "documents",
      className: "text-gray-700",
      Cell: ({ row }: any) => (
        <div className="flex flex-wrap gap-2">
          {row.documents?.map((fileUrl: string, index: number) => {
            const ext = fileUrl.split(".").pop()?.toLowerCase() || "";
            const isImage = isImageFile(fileUrl);
            const fullUrl =
              IMAGE_URL +
              (fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl);
            console.log("fileUrl:", fileUrl);
            console.log("fullUrl:", fullUrl);

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
      header: "Notes",
      accessor: "notes",
      className: "text-gray-700",
    },
    {
      header: "Completion Date",
      accessor: "completionDate",
      className: "text-gray-700",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{t("historyOfMaintenance")}</h2>

      <SMSTable
        columns={columns}
        data={historyOfMaintenanceData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default HistoryOfMaintenance;

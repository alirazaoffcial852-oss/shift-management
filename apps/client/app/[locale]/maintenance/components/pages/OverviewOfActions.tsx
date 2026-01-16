"use client";

import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useTranslations } from "next-intl";
import TableActions from "../globals/TableActions";
import { useLocomotiveActionTable } from "@/hooks/locomotiveAction/useLocomotiveAction";
import { Button } from "@workspace/ui/components/button";
import { FileText, ImageIcon, FileType2, File } from "lucide-react";
import Image from "next/image";
import { IMAGE_URL } from "@/constants/env.constants";
import UploadDocumentsDailog from "../Dailog/UploadDocumentsDailog";
import EditActionDialog from "../Dailog/EditActionDailog";
import { useCompletionForm } from "@/hooks/locomotiveAction/useCompletedDailogForm";

const OverviewOfActions: React.FC = () => {
  const {
    activeDialogConfig,
    currentPage,
    totalPages,
    error,
    handlePageChange,
    handleSearchChange,
    showPagination,
    clearFilters,
    isLoading,
    getRowClassName,
    handleOpenExamineDialog,
    setExamineDialogConfig,
    finalData,
    handleCompleteLocomotiveAction,
    handleCloseExamineDialogWithRefresh,
    handleDateRangeChange,
    handleDeleteLocomotiveAction,
    examineEditDialogConfig,
    handleOpenExamineEditDialog,
    setExamineEditDialogConfig,
    handleCloseExamineEditDialog,
    handleOpenEditDocumentEditDialog,
    setEditDocumentEditDialogConfig,
  } = useLocomotiveActionTable();

  const {} = useCompletionForm();

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

  const isImageFile = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
      ext ?? ""
    );
  };

  const t = useTranslations("pages.maintenance");

  const columns = [
    {
      header: t("nameOfLok"),
      accessor: "nameOfLok",
      className: "font-semibold",
      headerClassName: "bg-gray-500 text-white",
    },
    {
      header: t("nameOfAction"),
      accessor: "nameOfAction",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: t("state"),
      accessor: "state",
      className: "tex-black",
      headerClassName: "text-gray-500",
      render: (value: string) => {
        let bgClass = "";
        let label = "";

        switch (value) {
          case "OFFER_OBTAINED":
            bgClass = "bg-red-100 text-red-900 border border-red-400";
            label = t("OfferObtained");
            break;
          case "IN_PROCESS":
            bgClass = "bg-yellow-100 text-yellow-900 border border-yellow-400";
            label = t("InProcess");
            break;
          case "COMPLETED":
            bgClass = "bg-green-100 text-green-900 border border-green-400";
            label = t("Completed");
            break;
          default:
            bgClass = "bg-gray-100 text-gray-900";
            label = value || "-";
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgClass}`}
          >
            {label}
          </span>
        );
      },
    },

    {
      header: t("documents"),
      accessor: "documents",
      className: "font-semibold",
      headerClassName: "text-gray-500",
      render: (fileUrls: string[]) => {
        if (!fileUrls || fileUrls.length === 0) {
          return (
            <div className="flex items-center justify-center h-12 w-12 bg-gray-100 rounded">
              <File className="h-6 w-6 text-gray-500" />
            </div>
          );
        }

        return (
          <div className="flex gap-2 flex-wrap">
            {fileUrls.map((fileUrl, idx) => {
              const previewUrl = IMAGE_URL + fileUrl;
              const ext = fileUrl.split(".").pop()?.toLowerCase() || "";

              const isImage = isImageFile(fileUrl);

              return (
                <div
                  key={idx}
                  className="relative h-12 w-12 rounded-lg overflow-hidden cursor-pointer border flex items-center justify-center bg-gray-100"
                  onClick={() => window.open(previewUrl, "_blank")}
                >
                  {isImage ? (
                    <Image
                      src={previewUrl}
                      alt={`Document ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    getFileTypeIcon(ext)
                  )}
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      header: t("completionDate"),
      accessor: "completionDate",
      className: "font-semibold",
      headerClassName: "text-gray-500",
      render: (value: string) => value || "-",
    },
    {
      header: t("notes"),
      accessor: "notes",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: t("reason"),
      accessor: "reason",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
  ];

  const actions = [
    {
      label: t("actions"),
      element: (row: any) => (
        <TableActions
          row={row}
          handleOpenAddDialog={handleOpenExamineDialog}
          completeAction={() =>
            handleCompleteLocomotiveAction(row.completionId)
          }
          onDelete={() => handleDeleteLocomotiveAction(row.id)}
          handleEditAction={handleOpenExamineEditDialog}
          handleEditDocument={handleOpenEditDocumentEditDialog}
        />
      ),
    },
  ];

  if (error) {
    return (
      <div className="max-w-[1371px]">
        <div className="text-red-500 p-4">
          {error}
          <Button
            onClick={clearFilters}
            className="ml-4 text-sm"
            variant="outline"
          >
            {t("clearFilters")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-[1371px] p-4">
        <div className="flex justify-between items-center gap-4">
          <p className="font-semibold text-3xl">{t("overviewOfActions")}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full border border-red-400"></span>
              <span>{t("OfferObtained")}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full border border-yellow-400"></span>
              <span>{t("InProcess")}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full border border-green-400"></span>
              <span>{t("Completed")}</span>
            </div>
          </div>
        </div>
        <SMSTable
          onSearchChange={handleSearchChange}
          onDateRangeChange={handleDateRangeChange}
          search={true}
          dateTimeFilter={true}
          columns={columns}
          data={finalData}
          actions={actions}
          actionsHeader={t("actions")}
          currentPage={showPagination ? currentPage : 1}
          totalPages={showPagination ? totalPages : 1}
          onPageChange={handlePageChange}
          pagination={true}
          enableSelection={false}
          isLoading={isLoading}
          className="w-full overflow-x-auto mt-6 border-separate border-spacing-y-3"
          getRowClassName={getRowClassName}
        />
      </div>
      <UploadDocumentsDailog
        isOpen={activeDialogConfig.isOpen}
        onOpenChange={(open) => {
          setExamineDialogConfig((prev) => ({ ...prev, isOpen: open }));
          setEditDocumentEditDialogConfig((prev) => ({
            ...prev,
            isOpen: open,
          }));
        }}
        onClose={handleCloseExamineDialogWithRefresh}
        type={activeDialogConfig.type}
        id={activeDialogConfig.id}
      />
      <EditActionDialog
        isOpen={examineEditDialogConfig.isOpen}
        onOpenChange={(open) =>
          setExamineEditDialogConfig((prev) => ({ ...prev, isOpen: open }))
        }
        onClose={handleCloseExamineEditDialog}
        type={examineEditDialogConfig.type}
        id={examineEditDialogConfig.id}
      />
    </>
  );
};

export default OverviewOfActions;

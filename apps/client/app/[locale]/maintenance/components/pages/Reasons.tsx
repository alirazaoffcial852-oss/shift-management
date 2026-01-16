"use client";

import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import TableActions from "../globals/TableActions";
import { useTranslations } from "next-intl";
import { Button } from "@workspace/ui/components/button";
import homeIcon from "@/public/images/home.svg";
import Image from "next/image";
import ReasonDialog from "../Dailog/ReasonDailog";
import { useReasonTable } from "@/hooks/reason/useReasonTable";

const Reasons: React.FC = () => {
  const t = useTranslations("pages.maintenance");

  const {
    currentPage,
    totalPages,
    reasons,
    isLoading,
    isDeleting,
    error,
    handlePageChange,
    refetch,
    columns,
    dialogConfig,
    setDialogConfig,
    handleCloseDialog,
    handleOpenAddDialog,
    clearFilters,
    handleDelete,
    handleSearchChange,
    handleDateRangeChange,
    showPagination,
  } = useReasonTable(t);

  const actions = [
    {
      label: t("action"),
      element: (row: any) => (
        <TableActions
          row={row}
          handleOpenAddDialog={handleOpenAddDialog}
          onDelete={handleDelete}
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
      <div className="max-w-[1371px]">
        <div className="flex justify-between items-center gap-4">
          <p className="font-semibold text-3xl">{t("reasons")}</p>
          <Button
            onClick={() => handleOpenAddDialog({ type: "add" })}
            className="flex w-[187px] rounded-full h-[56px] items-center gap-2 shadow-lg transition-all duration-200"
            disabled={isDeleting}
          >
            <Image
              src={homeIcon}
              width={15}
              height={15}
              alt="Add Action Icon"
            />
            {t("AddReason")}
          </Button>
        </div>
        <div className="p-4">
          <SMSTable
            onSearchChange={handleSearchChange}
            onDateRangeChange={handleDateRangeChange}
            search={true}
            dateTimeFilter={true}
            columns={columns}
            data={reasons}
            actions={actions}
            actionsHeader={t("action")}
            currentPage={showPagination ? currentPage : 1}
            totalPages={showPagination ? totalPages : 1}
            onPageChange={handlePageChange}
            pagination={showPagination}
            enableSelection={false}
            isLoading={isLoading}
            className="w-full overflow-x-auto mt-6"
          />
        </div>
      </div>
      <ReasonDialog
        isOpen={dialogConfig.isOpen}
        onOpenChange={(open) =>
          setDialogConfig((prev) => ({ ...prev, isOpen: open }))
        }
        onClose={handleCloseDialog}
        type={dialogConfig.type}
        id={dialogConfig.id}
        refetch={refetch}
      />
    </>
  );
};

export default Reasons;

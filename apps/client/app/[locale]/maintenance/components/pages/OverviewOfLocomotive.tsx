"use client";

import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import React, { useState } from "react";
import TableActions from "../globals/TableActions";
import { useTranslations } from "next-intl";
import ActionDialog from "../Dailog/ActionDailog";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import ViewDetailsDialog from "../Dailog/ViewDetailsDailog";
import { useLocomotiveActionTable } from "@/hooks/locomotiveAction/useLocomotiveAction";

const OverviewOfLocomotive: React.FC = () => {
  const { locomotives, currentPage, setCurrentPage } = useLocomotiveTable();

  const {
    viewDetailsDialogConfig,
    handleOpenViewDetailsDialog,
    handleCloseViewDetailsDialog,
    setViewDetailsDialogConfig,
    actionsForSelectedLocomotive,
  } = useLocomotiveActionTable();

  const [dialogConfig, setDialogConfig] = useState({
    isOpen: false,
    type: "add" as "add" | "edit",
    id: undefined as string | undefined,
  });

  const handleOpenAddDialog = ({
    type,
    id,
  }: {
    type: "add" | "edit";
    id?: string;
  }) => {
    setDialogConfig({
      isOpen: true,
      type,
      id,
    });
  };

  const handleCloseDialog = () => {
    setDialogConfig((prev) => ({
      ...prev,
      isOpen: false,
      id: undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const data =
    locomotives?.map((loc) => ({
      id: loc.id,
      name: loc.name,
    })) || [];

  const t = useTranslations("pages.maintenance");

  const columns = [
    {
      header: t("name"),
      accessor: "name",
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
          handleOpenAddDialog={handleOpenAddDialog}
          handleOpenViewDetailsDialog={handleOpenViewDetailsDialog}
        />
      ),
    },
  ];

  return (
    <div>
      <p className="font-semibold text-3xl">{t("overviewOfLocomotive")}</p>
      <div className="max-w-[1371px] p-4">
        <SMSTable
          search={true}
          columns={columns}
          data={data}
          actions={actions}
          actionsHeader={t("actions")}
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / 10)}
          onPageChange={handlePageChange}
          pagination={true}
          enableSelection={false}
          className="w-full overflow-x-auto mt-6"
        />
      </div>
      <ActionDialog
        isOpen={dialogConfig.isOpen}
        onOpenChange={(open) =>
          setDialogConfig((prev) => ({ ...prev, isOpen: open }))
        }
        onClose={handleCloseDialog}
        type={dialogConfig.type}
        id={dialogConfig.id}
      />
      <ViewDetailsDialog
        isOpen={viewDetailsDialogConfig.isOpen}
        onOpenChange={(open) =>
          setViewDetailsDialogConfig((prev) => ({ ...prev, isOpen: open }))
        }
        onClose={handleCloseViewDetailsDialog}
        type={viewDetailsDialogConfig.type}
        id={viewDetailsDialogConfig.id}
        actionsForSelectedLocomotive={actionsForSelectedLocomotive}
      />
    </div>
  );
};

export default OverviewOfLocomotive;

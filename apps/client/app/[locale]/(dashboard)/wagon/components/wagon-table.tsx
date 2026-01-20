"use client";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useWagonTable } from "@/hooks/wagon/useWagonForm";
import {
  getWagonTableColumns,
  getWagonTableActions,
  getWagonFilterOptions,
} from "./table-essentials";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

interface WagonTableComponentProps {
  searchParams?: {
    page?: string;
    search?: string;
    status?: string;
  };
}

const WagonTableComponent: React.FC<WagonTableComponentProps> = ({ searchParams }) => {
  const router = useRouter();

  const initialPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const initialSearch = searchParams?.search || "";

  const {
    wagons,
    currentPage,
    totalPages,
    isLoading,
    selectedRows,
    setSelectedRows,
    handleEdit,
    handleDelete,
    onPageChange,
    handleSearch,
    handleFilter,
  } = useWagonTable(initialPage, initialSearch);
  const t = useTranslations();

  const columns = getWagonTableColumns(t);
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");
  const tLabel = useTranslations("components.sidebar");
  const tCommon = useTranslations("common");
  const allActions = getWagonTableActions(
    handleEdit,
    handleDelete,
    t,
    tActions,
    tMessages,
    tLabel,
    tCommon
  );
  
  const { hasPermission } = usePermission();

  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("wagon.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("wagon.delete");
    }
    return true;
  });
  const filterOptions = getWagonFilterOptions(t);
  const tWagon = useTranslations("pages.wagon");

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center">
        <h2>{tWagon("wagon")}</h2>
        {hasPermission("wagon.create") && (
        <SMSButton
          startIcon={<PlusIcon />}
          text={tWagon("add") + " " + tWagon("wagon")}
          className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
          onClick={() => router.push("/wagon/add")}
        />
        )}
      </div>

      <SMSTable
        columns={columns}
        data={wagons}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        search={true}
        onSearchChange={handleSearch}
        showFilter={true}
        filterOptions={filterOptions}
        onFilterChange={handleFilter}
        filterLabel={t("components.sidebar.select_status")}
        filterPlaceholder={t("components.sidebar.select_status")}
        actionsHeader={tWagon("actions")}
        pagination={true}
      />
    </div>
  );
};

export default WagonTableComponent;

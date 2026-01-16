"use client";

import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { useState } from "react";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import { LocationType } from "@/types/location";
import {
  useLocationColumns,
  useLocationActions,
  LocationActionCallbacks,
} from "./table-essentails";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

const LocationsList = () => {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const {
    locations,
    loading,
    pagination,
    handleSearch,
    handleFilter,
    handlePageChange,
    handleDelete,
    filterType,
  } = useLocationsList();
  const { hasPermission } = usePermission();

  const columns = useLocationColumns();

  const actionCallbacks: LocationActionCallbacks = {
    onDelete: (id) => {
      handleDelete(id);
    },
  };

  const allActions = useLocationActions(actionCallbacks);
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("location.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("location.delete");
    }
    return true;
  });

  const tLocations = useTranslations("pages.locations");

  const filterOptions = [
    { value: LocationType.WAREHOUSE, label: tLocations("warehouse") },
    { value: LocationType.TARIF_POINT, label: tLocations("tariffPoint") },
    { value: LocationType.SUPPLIER_PLANT, label: tLocations("supplierPlant") },
  ];

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center">
        <h2>{tLocations("location")}</h2>

        {hasPermission("location.create") && (
          <SMSButton
            startIcon={<PlusIcon />}
            text={tLocations("addLocation")}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/locations/add")}
          />
        )}
      </div>

      <SMSTable
        columns={columns}
        data={locations}
        actions={actions}
        currentPage={pagination.current_page}
        totalPages={pagination.total_pages}
        onPageChange={handlePageChange}
        isLoading={loading}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        search={true}
        onSearchChange={handleSearch}
        showFilter={true}
        filterOptions={filterOptions}
        onFilterChange={handleFilter}
        filterLabel={tLocations("filterByType")}
        filterPlaceholder={tLocations("selectType")}
        selectedFilterValue={filterType}
        actionsHeader={tLocations("actions")}
      />
    </div>
  );
};

export default LocationsList;

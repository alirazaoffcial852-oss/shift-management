import React from "react";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { WagonFilters } from "@/types/projectUsn";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import { useWagonFilterOptions } from "../hooks/useWagonFilterOptions";

interface WagonFiltersProps {
  filters: WagonFilters;
  onFilterChange: (field: keyof WagonFilters, value: string) => void;
  statusOptions: Array<{ value: string; label: string }>;
  wagonTypeOptions: Array<{ value: string; label: string }>;
  railOptions: Array<{ value: string; label: string }>;
  t: (key: string) => string;
}

export const WagonFiltersSection: React.FC<WagonFiltersProps> = ({
  filters,
  onFilterChange,
  statusOptions,
  wagonTypeOptions,
  railOptions,
  t,
}) => {
  const { locations, loading: loadingLocations } = useLocationsList();

  return (
    <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
      <SMSCombobox
        placeholder={t("filters.location")}
        value={filters.location}
        onValueChange={(value) => onFilterChange("location", value)}
        options={locations.map((location) => ({
          value: location.id.toString(),
          label: location.name,
        }))}
        disabled={loadingLocations}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("filters.status")}
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
        options={statusOptions}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("filters.wagonType")}
        value={filters.wagonType}
        onValueChange={(value) => onFilterChange("wagonType", value)}
        options={wagonTypeOptions}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("filters.rail")}
        value={filters.rail}
        onValueChange={(value) => onFilterChange("rail", value)}
        options={railOptions}
        className="w-full"
      />
      <SMSCombobox
        placeholder={t("tableHeaders.nextStatus")}
        value={filters.nextStatus}
        onValueChange={(value) => onFilterChange("nextStatus", value)}
        options={statusOptions}
        className="w-full"
      />
      <SMSInput
        type="date"
        value={filters.date}
        onChange={(e) => onFilterChange("date", e.target.value)}
        placeholder={t("filters.date")}
        className="w-full"
      />
    </div>
  );
};

"use client";

import React from "react";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { WagonFilters } from "@/types/projectUsn";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import { Calendar } from "lucide-react";

interface WagonData {
  id: number;
  wagon_number: number;
  status: string;
  location_id: number;
  location_name?: string;
  rail: string;
  position: string;
  wagon_type: string;
  maximun_capacity_of_load_weight: number;
  has_damage: boolean;
  nextStatus?: string;
  loadedEmptyLocation?: string;
  currentLocation?: string;
}

interface TableViewProps {
  wagons: WagonData[];
  filters: WagonFilters;
  onFilterChange: (field: keyof WagonFilters, value: string) => void;
}

const TableView: React.FC<TableViewProps> = ({
  wagons,
  filters,
  onFilterChange,
}) => {
  const { locations, loading: loadingLocations } = useLocationsList();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EMPTY":
        return "bg-gray-100 text-gray-600";
      case "PLANNED_TO_BE_LOADED":
      case "SHOULD_BE_LOADED":
      case "PLANNED_TO_BE_EMPTY":
      case "SHOULD_BE_EMPTY":
        return "bg-yellow-100 text-yellow-800";
      case "LOADED":
        return "bg-green-100 text-green-800";
      case "DAMAGED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Wagons Database</h2>

      <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
        <SMSCombobox
          placeholder="Location"
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
          placeholder="Status"
          value={filters.status}
          onValueChange={(value) => onFilterChange("status", value)}
          options={[
            { value: "EMPTY", label: "Empty" },
            { value: "PLANNED_TO_BE_LOADED", label: "Planned To Be Loaded" },
            { value: "SHOULD_BE_LOADED", label: "Should Be Loaded" },
            { value: "LOADED", label: "Loaded" },
            { value: "PLANNED_TO_BE_EMPTY", label: "Planned To Be Empty" },
            { value: "SHOULD_BE_EMPTY", label: "Should Be Empty" },
            { value: "DAMAGED", label: "Damaged" },
          ]}
          className="w-full"
        />
        <SMSCombobox
          placeholder="Wagon Type"
          value={filters.wagonType}
          onValueChange={(value) => onFilterChange("wagonType", value)}
          options={[
            { value: "Fac (s)", label: "Fac (s)" },
            { value: "Fas", label: "Fas" },
            { value: "FACS", label: "FACS" },
            { value: "FAS", label: "FAS" },
          ]}
          className="w-full"
        />
        <SMSCombobox
          placeholder="Loaded Location"
          value={filters.loadedLocation}
          onValueChange={(value) => onFilterChange("loadedLocation", value)}
          options={locations.map((location) => ({
            value: location.id.toString(),
            label: location.name,
          }))}
          disabled={loadingLocations}
          className="w-full"
        />
        <SMSCombobox
          placeholder="Rail"
          value={filters.rail}
          onValueChange={(value) => onFilterChange("rail", value)}
          options={[
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "on train", label: "on train" },
          ]}
          className="w-full"
        />
        <SMSCombobox
          placeholder="Next Status"
          value={filters.nextStatus}
          onValueChange={(value) => onFilterChange("nextStatus", value)}
          options={[
            { value: "N/A", label: "N/A" },
            { value: "EMPTY", label: "Empty" },
            { value: "LOADED", label: "Loaded" },
          ]}
          className="w-full"
        />
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <SMSInput
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[600px] border border-gray-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 sticky top-0">
              <th className="border border-gray-300 px-4 py-2 text-left w-12"></th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Wagon No
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Next Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Current Location
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Loaded / Empty Location
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Type of Wagon
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Max Capacity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Rail
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Position
              </th>
            </tr>
          </thead>
          <tbody>
            {wagons.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                >
                  No wagons found in route planning
                </td>
              </tr>
            ) : (
              wagons.map((wagon) => {
                const location = locations.find(
                  (loc) => loc.id === wagon.location_id
                );
                return (
                  <tr key={wagon.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {wagon.wagon_number}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(wagon.status)}`}
                      >
                        {wagon.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {wagon.nextStatus || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {location?.name || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {wagon.loadedEmptyLocation || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {wagon.wagon_type}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {wagon.maximun_capacity_of_load_weight} Tons
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {wagon.rail}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {wagon.position}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;

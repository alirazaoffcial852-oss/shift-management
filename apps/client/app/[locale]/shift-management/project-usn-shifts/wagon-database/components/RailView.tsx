"use client";

import React, { useMemo } from "react";
import { WagonFilters } from "@/types/projectUsn";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import Image from "next/image";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Calendar } from "lucide-react";
import railImage from "../../../../../../assets/wagon/rail.svg";
import greenColorWagon from "../../../../../../assets/wagon/green-color-wagon.svg";
import yellowColorWagon from "../../../../../../assets/wagon/yellow-color-wagon.svg";
import redColorWagon from "../../../../../../assets/wagon/red-color-wagon.svg";

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

interface RailViewProps {
  wagons: WagonData[];
  filters: WagonFilters;
  onFilterChange: (field: keyof WagonFilters, value: string) => void;
  locations?: any[];
}

const RailView: React.FC<RailViewProps> = ({
  wagons,
  filters,
  onFilterChange,
  locations: locationsProp,
}) => {
  const locationsHook = useLocationsList();
  const locations = locationsProp || locationsHook.locations;
  const loadingLocations = locationsProp ? false : locationsHook.loading;

  const wagonsByRail = useMemo(() => {
    const grouped: Record<string, WagonData[]> = {};
    wagons.forEach((wagon) => {
      const rail = wagon.rail || "1";
      if (!grouped[rail]) {
        grouped[rail] = [];
      }
      grouped[rail].push(wagon);
    });

    Object.keys(grouped).forEach((rail) => {
      if (grouped[rail]) {
        grouped[rail].sort((a, b) => {
          const posA = parseInt(a.position ?? "0", 10) || 0;
          const posB = parseInt(b.position ?? "0", 10) || 0;
          return posA - posB;
        });
      }
    });

    return grouped;
  }, [wagons]);

  const getWagonImage = (wagon: WagonData): string => {
    if (wagon.status === "LOADED") {
      return greenColorWagon;
    }
    if (wagon.wagon_type === "FACS" || wagon.wagon_type === "Fac (s)") {
      return yellowColorWagon;
    }
    if (wagon.wagon_type === "FAS") {
      return redColorWagon;
    }
    return yellowColorWagon;
  };

  const shouldShowStatusDot = (wagon: WagonData) => {
    return wagon.status === "LOADED";
  };

  const rails = useMemo(() => {
    const uniqueRails = new Set<string>();
    wagons.forEach((wagon) => {
      uniqueRails.add(wagon.rail || "1");
    });
    return Array.from(uniqueRails).sort();
  }, [wagons]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-center w-full">
          Warehouse Plan
        </h2>
      </div>

      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
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
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <SMSInput
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange("date", e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-red-700 text-red-600 focus:ring-red-500 appearance-none checked:bg-red-600 checked:border-red-700"
              style={{
                borderColor: "red",
              }}
            />
            <span className="text-sm font-medium">Fas</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-2 border-yellow-700 text-yellow-600 focus:ring-yellow-500 appearance-none checked:bg-yellow-600 checked:border-yellow-700"
              style={{
                borderColor: "yellow",
              }}
            />
            <span className="text-sm font-medium">Fac(s)</span>
          </label>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
            <span className="text-sm">Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 border border-green-700 rounded"></div>
            <span className="text-sm">Loaded</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {rails.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No wagons found</div>
        ) : (
          rails.map((railNumber) => {
            const railWagons = wagonsByRail[railNumber] || [];

            return (
              <div key={railNumber} className="space-y-2">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Rail {railNumber}
                </div>
                <div className="relative overflow-x-auto">
                  <div className="relative h-28 flex items-center min-w-full">
                    <div className="absolute inset-0 flex items-center overflow-hidden">
                      <div className="flex items-center h-full w-full">
                        {Array.from({
                          length: Math.max(railWagons.length * 2 + 5, 20),
                        }).map((_, index) => (
                          <Image
                            key={index}
                            src={railImage}
                            alt="Rail Track"
                            width={60}
                            height={10}
                            className="object-cover h-full"
                            style={{ minWidth: "60px", height: "10%" }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 z-10 relative w-full">
                      {railWagons.length === 0 ? (
                        <div className="text-gray-400 text-sm py-8 px-4">
                          No wagons on this rail
                        </div>
                      ) : (
                        railWagons.map((wagon) => (
                          <div
                            key={wagon.id}
                            className="relative flex flex-col items-center group cursor-pointer"
                            title={`Wagon ${wagon.wagon_number} - ${wagon.status} - ${wagon.wagon_type}`}
                          >
                            <div className="relative w-24 h-24 flex items-center justify-center -mt-12">
                              <Image
                                src={getWagonImage(wagon)}
                                alt={`Wagon ${wagon.wagon_number}`}
                                width={70}
                                height={70}
                                className="object-contain w-full h-full drop-shadow-md"
                              />
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-[10px] font-bold text-white drop-shadow-lg">
                                  {wagon.wagon_number.toString().slice(-4)}
                                </span>
                              </div>
                            </div>
                            {shouldShowStatusDot(wagon) && (
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full border border-white shadow-sm"></div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RailView;

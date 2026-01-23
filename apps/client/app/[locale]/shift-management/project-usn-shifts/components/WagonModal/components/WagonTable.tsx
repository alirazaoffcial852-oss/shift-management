import React, { RefObject } from "react";
import { WagonOption } from "@/types/projectUsn";
import { Loader2 } from "lucide-react";
import { WagonTableRow } from "./WagonTableRow";
import { getFilteredWagons } from "../utils/wagonModal.utils";

interface WagonTableProps {
  wagons: WagonOption[];
  modalType: "add" | "remove";
  selectedWagonIds: string[];
  onWagonSelection: (wagonId: string) => void;
  statusLabelMap: Record<string, string>;
  loadingMore: boolean;
  scrollContainerRef: RefObject<HTMLDivElement>;
  t: (key: string) => string;
}

export const WagonTable: React.FC<WagonTableProps> = ({
  wagons,
  modalType,
  selectedWagonIds,
  onWagonSelection,
  statusLabelMap,
  loadingMore,
  scrollContainerRef,
  t,
}) => {
  const filteredWagons = getFilteredWagons(wagons, modalType, selectedWagonIds);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left w-12"></th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.wagonNo")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.status")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.nextStatus")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.currentLocation")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.PlannedCurrentLocation")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.arrivalLocation")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.loadedEmptyLocation")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.typeOfWagon")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.maxCapacity")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.rail")}
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              {t("tableHeaders.position")}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredWagons.map((wagon) => (
            <WagonTableRow
              key={wagon.value}
              wagon={wagon}
              isSelected={selectedWagonIds.includes(wagon.value)}
              onWagonSelection={onWagonSelection}
              statusLabelMap={statusLabelMap}
              unknownText={t("unknown")}
            />
          ))}
          {loadingMore && (
            <tr>
              <td colSpan={12} className="border border-gray-300 px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Loading more wagons...
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

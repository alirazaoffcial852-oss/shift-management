import React from "react";
import { WagonOption } from "@/types/projectUsn";
import { formatLocation, getStatusBadgeClass } from "../utils/wagonModal.utils";

interface WagonTableRowProps {
  wagon: WagonOption;
  isSelected: boolean;
  onWagonSelection: (wagonId: string) => void;
  statusLabelMap: Record<string, string>;
  unknownText: string;
}

export const WagonTableRow: React.FC<WagonTableRowProps> = ({
  wagon,
  isSelected,
  onWagonSelection,
  statusLabelMap,
  unknownText,
}) => {
  return (
    <tr
      className={`hover:bg-gray-50 cursor-pointer ${
        isSelected ? "bg-blue-50" : ""
      }`}
      onClick={() => onWagonSelection(wagon.value)}
    >
      <td className="border border-gray-300 px-4 py-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onWagonSelection(wagon.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 cursor-pointer"
        />
      </td>
      <td className="border border-gray-300 px-4 py-2">{wagon.wagonNo}</td>
      <td className="border border-gray-300 px-4 py-2">
        <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(wagon.status)}`}>
          {statusLabelMap[wagon.status] || wagon.status}
        </span>
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {wagon.nextStatus === "No Changes" ? (
          wagon.nextStatus
        ) : (
          <span
            className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(wagon.nextStatus)}`}
          >
            {statusLabelMap[wagon.nextStatus] || wagon.nextStatus}
          </span>
        )}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {formatLocation(wagon.currentLocation, unknownText)}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {formatLocation(wagon.plannedCurrentLocation, unknownText)}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {wagon.arrivalLocation
          ? formatLocation(wagon.arrivalLocation, unknownText)
          : unknownText}
      </td>
      <td className="border border-gray-300 px-4 py-2">
        {wagon.loadedEmptyLocation}
      </td>
      <td className="border border-gray-300 px-4 py-2">{wagon.typeOfWagon}</td>
      <td className="border border-gray-300 px-4 py-2">{wagon.maxCapacity}</td>
      <td className="border border-gray-300 px-4 py-2">{wagon.rail}</td>
      <td className="border border-gray-300 px-4 py-2">{wagon.position}</td>
    </tr>
  );
};

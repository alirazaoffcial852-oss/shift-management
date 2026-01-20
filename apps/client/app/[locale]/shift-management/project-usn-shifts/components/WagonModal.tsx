"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { WagonFilters, WagonOption } from "@/types/projectUsn";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import { useTranslations } from "next-intl";

interface WagonModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "add" | "remove";
  wagonType: "first" | "second";
  wagons: WagonOption[];
  selectedWagonIds: string[];
  filters: WagonFilters;
  onFilterChange: (field: keyof WagonFilters, value: string) => void;
  onWagonSelection: (wagonId: string) => void;
  onResetFilters: () => void;
  currentPurpose?: string;
  pickupDate?: string;
  onPickupDateChange?: (date: string) => void;
}

const WagonModal: React.FC<WagonModalProps> = ({
  isOpen,
  onClose,
  modalType,
  wagonType,
  wagons,
  selectedWagonIds,
  filters,
  onFilterChange,
  onResetFilters,
  onWagonSelection,
  currentPurpose,
  pickupDate,
  onPickupDateChange,
}) => {
  const t = useTranslations("pages.projectUsn.wagonModal");
  const getFilteredWagons = () => {
    if (modalType === "remove") {
      return wagons.filter((wagon) => selectedWagonIds.includes(wagon.value));
    }

    return wagons;
  };

  const { locations, loading: loadingLocations } = useLocationsList();

  const statusOptions = useMemo(
    () => [
      { value: "EMPTY", label: t("filters.statusOptions.EMPTY") },
      {
        value: "PLANNED_TO_BE_LOADED",
        label: t("filters.statusOptions.PLANNED_TO_BE_LOADED"),
      },
      {
        value: "SHOULD_BE_LOADED",
        label: t("filters.statusOptions.SHOULD_BE_LOADED"),
      },
      { value: "LOADED", label: t("filters.statusOptions.LOADED") },
      {
        value: "PLANNED_TO_BE_EMPTY",
        label: t("filters.statusOptions.PLANNED_TO_BE_EMPTY"),
      },
      {
        value: "SHOULD_BE_EMPTY",
        label: t("filters.statusOptions.SHOULD_BE_EMPTY"),
      },
      { value: "DAMAGED", label: t("filters.statusOptions.DAMAGED") },
    ],
    [t]
  );

  const statusLabelMap = useMemo(
    () =>
      statusOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
    [statusOptions]
  );

  const wagonTypeOptions = useMemo(
    () => [
      { value: "Fac (s)", label: "Fac (S)" },
      { value: "Fas", label: t("filters.wagonTypes.fas") },
      { value: "Eaos", label: "Eaos" },
      { value: "Eanos", label: "Eanos" },
      { value: "Eamnos", label: "Eamnos" },
      { value: "Eas", label: "Eas" },
      { value: "Ealnos", label: "Ealnos" },
      { value: "Fa", label: "Fa" },
      { value: "Fas", label: "Fas" },
      { value: "Fac", label: "Fac" },
      { value: "Facs", label: "Facs" },
      { value: "Faccs", label: "Faccs" },
      { value: "Faccns", label: "Faccns" },
      { value: "Fals", label: "Fals" },
      { value: "Falns", label: "Falns" },
      { value: "Fans", label: "Fans" },
      { value: "Fanps", label: "Fanps" },
      { value: "Fads", label: "Fads" },
      { value: "Fadns", label: "Fadns" },
      { value: "Falrrs", label: "Falrrs" },
      { value: "Gbs", label: "Gbs" },
      { value: "Gabs", label: "Gabs" },
      { value: "Gbs-v", label: "Gbs-v" },
      { value: "Gabs-t", label: "Gabs-t" },
      { value: "Habbins", label: "Habbins" },
      { value: "Hbis", label: "Hbis" },
      { value: "Hbbins", label: "Hbbins" },
      { value: "Hbillns", label: "Hbillns" },
      { value: "Ibbhs", label: "Ibbhs" },
      { value: "Ibblps", label: "Ibblps" },
      { value: "Ibbins", label: "Ibbins" },
      { value: "Ks", label: "Ks" },
      { value: "Kls", label: "Kls" },
      { value: "Kbps", label: "Kbps" },
      { value: "Lgs", label: "Lgs" },
      { value: "Lgns", label: "Lgns" },
      { value: "Lgss", label: "Lgss" },
      { value: "Rils", label: "Rils" },
      { value: "Res", label: "Res" },
      { value: "Rens", label: "Rens" },
      { value: "Rils-x", label: "Rils-x" },
      { value: "Rs", label: "Rs" },
      { value: "Rmmps", label: "Rmmps" },
      { value: "Sgns", label: "Sgns" },
      { value: "Sggmrss", label: "Sggmrss" },
      { value: "Slpns", label: "Slpns" },
      { value: "Shimmns", label: "Shimmns" },
      { value: "Shamms", label: "Shamms" },
      { value: "Tagnpps", label: "Tagnpps" },
      { value: "Tagnpps-x", label: "Tagnpps-x" },
      { value: "T2000", label: "T2000" },
      { value: "T3000", label: "T3000" },
      { value: "Uacs", label: "Uacs" },
      { value: "Uacs-x", label: "Uacs-x" },
      { value: "Uagps", label: "Uagps" },
      { value: "Uapps", label: "Uapps" },
      { value: "Zacns", label: "Zacns" },
      { value: "Zans", label: "Zans" },
      { value: "Zacens", label: "Zacens" },
      { value: "Zagkks", label: "Zagkks" },
      { value: "Xas", label: "Xas" },
      { value: "Xmms", label: "Xmms" },
      { value: "Xns", label: "Xns" },
      { value: "Xrms", label: "Xrms" },
    ],
    [t]
  );

  const railOptions = useMemo(
    () => [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "on train", label: t("filters.railOptions.onTrain") },
    ],
    [t]
  );

  const formatLocation = (location: unknown) => {
    if (!location) {
      return "N/A";
    }

    if (typeof location === "string") {
      return location;
    }

    if (typeof location === "object") {
      const {
        name,
        location: locName,
        type,
      } = location as {
        name?: string;
        location?: string;
        type?: string;
      };

      const parts = [name, locName, type?.replace(/_/g, " ").toLowerCase()]
        .filter(Boolean)
        .map((part) => (typeof part === "string" ? part.trim() : part));

      return parts.length ? parts.join(" - ") : t("unknown");
    }

    return String(location);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(`titles.${modalType}.${wagonType}`)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pb-4">
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

          <div className="overflow-x-auto overflow-y-auto max-h-[400px] border border-gray-300 rounded-lg">
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
                {getFilteredWagons().map((wagon) => {
                  const isSelected = selectedWagonIds.includes(wagon.value);
                  return (
                    <tr
                      key={wagon.value}
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
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.wagonNo}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            wagon.status === "EMPTY"
                              ? "bg-gray-100 text-gray-600"
                              : wagon.status === "PLANNED_TO_BE_LOADED" ||
                                  wagon.status === "SHOULD_BE_LOADED" ||
                                  wagon.status === "PLANNED_TO_BE_EMPTY" ||
                                  wagon.status === "SHOULD_BE_EMPTY"
                                ? "bg-yellow-100 text-yellow-800"
                                : wagon.status === "LOADED"
                                  ? "bg-green-100 text-green-800"
                                  : wagon.status === "DAMAGED"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {statusLabelMap[wagon.status] || wagon.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.nextStatus === "No Changes" ? (
                          wagon.nextStatus
                        ) : (
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              wagon.nextStatus === "EMPTY"
                                ? "bg-gray-100 text-gray-600"
                                : wagon.nextStatus === "PLANNED_TO_BE_LOADED" ||
                                    wagon.nextStatus === "SHOULD_BE_LOADED" ||
                                    wagon.nextStatus ===
                                      "PLANNED_TO_BE_EMPTY" ||
                                    wagon.nextStatus === "SHOULD_BE_EMPTY"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : wagon.nextStatus === "LOADED"
                                    ? "bg-green-100 text-green-800"
                                    : wagon.nextStatus === "DAMAGED"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {statusLabelMap[wagon.nextStatus] ||
                              wagon.nextStatus}
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {formatLocation(wagon.currentLocation)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.arrivalLocation
                          ? formatLocation(wagon.arrivalLocation)
                          : t("unknown")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.loadedEmptyLocation}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.typeOfWagon}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.maxCapacity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.rail}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {wagon.position}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {wagonType === "second" && currentPurpose === "Supplying" && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-blue-900 whitespace-nowrap">
                {t("pickup.label")}
              </label>
              <SMSInput
                type="date"
                value={pickupDate || ""}
                onChange={(e) => onPickupDateChange?.(e.target.value)}
                className="w-64"
                placeholder={t("pickup.placeholder")}
                required
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center w-full">
          <div className="flex-1">
            <SMSButton
              variant="outline"
              type="button"
              onClick={onResetFilters}
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 px-6"
            >
              Reset Filter
            </SMSButton>
          </div>
          <div className="flex gap-2">
            <SMSButton variant="outline" onClick={onClose} className="px-6">
              {t("buttons.cancel")}
            </SMSButton>
            <SMSButton
              onClick={onClose}
              className="bg-[#3E8258] hover:bg-[#3E8258]/90 text-white px-8"
            >
              {t("buttons.done")}
            </SMSButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WagonModal;

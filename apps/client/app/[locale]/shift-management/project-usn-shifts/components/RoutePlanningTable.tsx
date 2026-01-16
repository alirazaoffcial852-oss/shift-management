"use client";

import React, { useMemo } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { Plus, Minus, Trash, Download, FileText, Calendar } from "lucide-react";
import { RoutePlanningRow, RoutePlanningRowErrors } from "@/types/projectUsn";
import { PURPOSE_OPTIONS } from "@/types/projectUsn";
import { Order } from "@/types/order";
import { Location } from "@/types/location";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { RouteLocationPDF } from "../usn-shifts/(views)/monthly/[id]/components/RouteLocationPDF";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useTranslations } from "next-intl";

interface RoutePlanningTableProps {
  routePlanning: RoutePlanningRow[];
  onAddRow: () => void;
  orders: Order[];
  wagons: any[];
  onRemoveRow: (rowId: string) => void;
  onUpdateRow: (
    rowId: string,
    field: keyof RoutePlanningRow,
    value: any
  ) => void;
  onOpenWagonModal: (
    type: "add" | "remove",
    rowId: string,
    wagonType: "first" | "second"
  ) => void;
  onOpenOrderModal: (rowId: string) => void;
  locations: Location[];
  errors?: Record<string, RoutePlanningRowErrors>;
}

const RoutePlanningTable: React.FC<RoutePlanningTableProps> = ({
  routePlanning,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onOpenWagonModal,
  onOpenOrderModal,
  orders,
  locations,
  wagons,
  errors,
}) => {
  const t = useTranslations("pages.projectUsn.routePlanning");
  const tPdf = useTranslations("pdf");

  const purposeOptions = useMemo(
    () =>
      PURPOSE_OPTIONS.map((option) => ({
        ...option,
        label: t(`purposes.${option.value}`),
      })),
    [t]
  );

  const handlePurposeChange = async (
    rowId: string,
    purpose: string,
    wagonIds: string[]
  ) => {
    onUpdateRow(rowId, "selectPurpose", purpose);

    if (purpose !== "Storaging" && wagonIds && wagonIds.length > 0) {
      try {
        const wagonIdsAsNumbers = wagonIds.map((id) => parseInt(id));
        const response = await ProjectUSNShiftsService.getWagonsByPurpose(
          purpose.toUpperCase(),
          wagonIdsAsNumbers
        );
        if (response) {
          toast.success(t("messages.wagonStatusUpdated"));
        }
      } catch (error: any) {
        toast.error(t("messages.wagonStatusFailed"));
      }
    }
  };

  const handleDownloadLocationPDF = async (
    row: RoutePlanningRow,
    locationType: "start" | "end"
  ) => {
    try {
      const firstIds = row.selectWagon || [];
      const secondIds = row.selectSecondWagon || [];

      const targetIds = locationType === "start" ? firstIds : secondIds;

      const parseOptionalNumber = (value: unknown): number | undefined => {
        if (value === undefined || value === null || value === "") {
          return undefined;
        }
        const num = Number(value);
        return Number.isFinite(num) ? num : undefined;
      };

      const getFirstDetail = <T = any,>(value: unknown): T | undefined => {
        if (!value) return undefined;
        if (Array.isArray(value) && value.length > 0) {
          return value[0] as T;
        }
        return value as T;
      };

      const makeWagonData = (ids: string[], actionLabel: string) =>
        ids
          .filter((wagonId): wagonId is string => Boolean(wagonId))
          .map((wagonId) => {
            const wagon = wagons.find((w) => w.value === wagonId);
            if (!wagon) {
              return null;
            }

            const rawWagonNumber =
              (wagon as any).wagon_number ??
              (wagon as any).wagonNumber ??
              (wagon as any).wagonNo?.replace("Wagon ", "") ??
              wagon.label ??
              wagonId;

            const normalizedWagonNumberString = rawWagonNumber
              ? rawWagonNumber.toString().replace(/\D/g, "").slice(0, 12)
              : "0";

            const normalizedWagonNumber = Number.parseInt(
              normalizedWagonNumberString || "0",
              10
            );

            const currentLocation = (() => {
              const locationValue = wagon.currentLocation;
              if (!locationValue) return "";
              if (typeof locationValue === "string") return locationValue;
              if (typeof locationValue === "object") {
                if (
                  "name" in locationValue &&
                  typeof locationValue.name === "string"
                ) {
                  return locationValue.name;
                }
                if (
                  "location" in locationValue &&
                  typeof locationValue.location === "string"
                ) {
                  return locationValue.location;
                }
              }
              return "";
            })();

            const weightOfWagonItself =
              parseOptionalNumber(
                (wagon as any).weight_of_the_wagon_itself ??
                  (wagon as any).weightOfTheWagonItself
              ) ?? undefined;

            const weightOfLoad =
              parseOptionalNumber(
                (wagon as any).weight_of_load ?? (wagon as any).weightOfLoad
              ) ?? undefined;

            const emptyAxles =
              parseOptionalNumber(
                (wagon as any).empty_axles ?? (wagon as any).emptyAxles
              ) ?? undefined;

            const loadedAxles =
              parseOptionalNumber(
                (wagon as any).loaded_axles ?? (wagon as any).loadedAxles
              ) ?? undefined;

            const lengthOverBuffer =
              (wagon as any).length_over_buffer ??
              (wagon as any).lengthOverBuffer ??
              undefined;

            const manualDetailsSource = getFirstDetail(
              (wagon as any).wagon_brake_manual_details ??
                (wagon as any).brake_manual_details ??
                (wagon as any).brakeManualDetails ??
                (wagon as any).brakeManualDetail
            );

            const autoDetailsSource = getFirstDetail(
              (wagon as any).wagon_brake_auto_details ??
                (wagon as any).brake_auto_details ??
                (wagon as any).brakeAutoDetails ??
                (wagon as any).brakeAutoDetail
            );

            const brakeManualDetails = manualDetailsSource
              ? {
                  empty_braking_weight:
                    manualDetailsSource.empty_braking_weight ??
                    manualDetailsSource.emptyBrakingWeight ??
                    "",
                  full_braking_weight:
                    manualDetailsSource.full_braking_weight ??
                    manualDetailsSource.fullBrakingWeight ??
                    "",
                  conversion_weight:
                    manualDetailsSource.conversion_weight ??
                    manualDetailsSource.conversionWeight ??
                    "",
                }
              : undefined;

            const brakeAutoDetails = autoDetailsSource
              ? {
                  maximum_braking_weight:
                    autoDetailsSource.maximum_braking_weight ??
                    autoDetailsSource.maximumBrakingWeight ??
                    "",
                }
              : undefined;

            return {
              id: Number.parseInt(wagonId, 10),
              wagon_id: Number.parseInt(wagonId, 10),
              action: actionLabel,
              wagon: {
                wagon_number: normalizedWagonNumber,
                status: wagon.status || "EMPTY",
                location: currentLocation,
                wagon_type: wagon.typeOfWagon || "FAS",
                maximun_capacity_of_load_weight: Number.parseFloat(
                  wagon.maxCapacity?.replace(" Tons", "") || "0"
                ),
                rail: wagon.rail || "1",
                position: wagon.position || "1",
                has_damage: Boolean(wagon.has_damage),
                weight_of_the_wagon_itself: weightOfWagonItself,
                weight_of_load: weightOfLoad,
                empty_axles: emptyAxles,
                loaded_axles: loadedAxles,
                length_over_buffer:
                  lengthOverBuffer !== undefined && lengthOverBuffer !== null
                    ? String(lengthOverBuffer)
                    : "",
                brake_manual_details: brakeManualDetails,
                brake_auto_details: brakeAutoDetails,
                braking_type:
                  (wagon as any).braking_type ??
                  (wagon as any).brakingType ??
                  "",
                parking_brake: Boolean(
                  (wagon as any).parking_brake ?? (wagon as any).parkingBrake
                ),
                has_automatic_brake: Boolean(
                  (wagon as any).has_automatic_brake ??
                    (wagon as any).hasAutomaticBrake
                ),
                has_rent: Boolean(
                  (wagon as any).has_rent ?? (wagon as any).hasRent ?? false
                ),
                wagon_rents:
                  (wagon as any).wagon_rents ??
                  (wagon as any).wagonRents ??
                  undefined,
              },
            };
          })
          .filter(
            (wagonData): wagonData is NonNullable<typeof wagonData> =>
              wagonData !== null
          );

      const droppedIds = firstIds.filter((id) => !secondIds.includes(id));
      const droppedData = makeWagonData(droppedIds, row.selectPurpose || "");
      const leftData = makeWagonData(secondIds, "LEFT");

      const locationName =
        locationType === "start" ? row.startLocation : row.arrivalLocation;

      if (!locationName) {
        toast.error(t("messages.selectLocationFirst"));
        return;
      }

      if (locationType === "start") {
        if (targetIds.length === 0) {
          toast.error(t("messages.selectWagonsFirst"));
          return;
        }
      } else {
        if (firstIds.length === 0 && secondIds.length === 0) {
          toast.error(t("messages.selectWagonsFirst"));
          return;
        }

        if (droppedData.length === 0 && leftData.length === 0) {
          toast.error(t("messages.noWagonsEndDoc"));
          return;
        }
      }

      toast.loading(t("messages.generatingPdf"));

      const mainWagonData =
        locationType === "start"
          ? makeWagonData(firstIds, row.selectPurpose || "")
          : droppedData;
      const droppedWagonsData =
        locationType === "end" ? droppedData : undefined;
      const leftWagonsData = locationType === "end" ? leftData : undefined;

      const blob = await pdf(
        <RouteLocationPDF
          locationType={locationType}
          locationName={locationName}
          wagons={mainWagonData as any}
          droppedWagons={droppedWagonsData as any}
          leftWagons={leftWagonsData as any}
          routeInfo={{
            trainNo: row.train_no || "",
            purpose: row.selectPurpose || "",
            startLocation: row.startLocation || "",
            endLocation: row.arrivalLocation || "",
          }}
          t={tPdf}
        />
      ).toBlob();

      if (locationType === "start") {
        onUpdateRow(row.id, "starting_location_document", blob);
      } else {
        onUpdateRow(row.id, "ending_location_document", blob);
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${locationType}_location_document_${row.train_no || "draft"}.pdf`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success(t("messages.pdfSuccess"));
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error(t("messages.pdfFailed"));
    }
  };
  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 rounded-t-2xl rounded-b-2xl">
              <th className="px-4 py-2 text-left rounded-tl-2xl rounded-bl-2xl">
                {t("headers.startLocation")}
              </th>
              <th className="px-4 py-2 text-left">
                {t("headers.selectWagon")}
              </th>
              <th className="px-4 py-2 text-left">
                {t("headers.selectPurpose")}
              </th>
              <th className="px-4 py-2 text-left">{t("headers.orders")}</th>
              <th className="px-4 py-2 text-left">
                {t("headers.arrivalLocation")}
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                {t("headers.selectSecondWagon")}
              </th>
              <th className="px-4 py-2 text-left">{t("headers.trainNo")}</th>
              <th className="px-4 py-2 text-center whitespace-nowrap">
                {t("headers.startLocationDoc")}
              </th>
              <th className="px-4 py-2 text-center whitespace-nowrap">
                {t("headers.endLocationDoc")}
              </th>
              <th className="px-4 py-2 text-left">{t("headers.actions")}</th>
              <th className="px-4 py-2 text-center rounded-tr-2xl rounded-br-2xl">
                <button
                  type="button"
                  onClick={onAddRow}
                  className="p-2 bg-[#3E8258] text-white rounded-full hover:bg-[#3E8258]/90"
                  title={t("actions.addRow")}
                  aria-label={t("actions.addRow")}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {routePlanning.map((row) => {
              const getWagonTypeDisplay = (wagonIds: string[]) => {
                if (wagonIds.length === 0) return "0";

                const wagonTypes = wagonIds.map((id) => {
                  const wagon = wagons.find((w) => w.value === id);
                  return wagon?.typeOfWagon || "FAS";
                });

                const typeCounts = wagonTypes.reduce(
                  (acc, type) => {
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                  },
                  {} as Record<string, number>
                );

                return Object.entries(typeCounts)
                  .map(([type, count]) => `${count} ${type}`)
                  .join(", ");
              };

              const isPurposeSelected =
                row.selectPurpose && row.selectPurpose.trim() !== "";

              const isSecondWagonPlusDisabled =
                !isPurposeSelected ||
                ["Storaging", "Supplying", "Loading"].includes(
                  row.selectPurpose
                );

              const isOrdersEnabled = row.selectPurpose === "Supplying";
              const mustDropAll = [
                "Storaging",
                "Supplying",
                "Loading",
              ].includes(row.selectPurpose || "");
              const firstCount = (row.selectWagon || []).length;
              const secondCount = (row.selectSecondWagon || []).length;
              // Left to drop = still checked/kept in Select 2nd Wagon
              const leftCount = Math.max(0, secondCount);

              const rowErrors = errors?.[row.id];

              return (
                <tr key={row.id}>
                  <td className="border-b border-gray-300 px-4 py-5">
                    <div>
                      <SMSCombobox
                        value={row.startLocation}
                        onValueChange={(value) =>
                          onUpdateRow(row.id, "startLocation", value)
                        }
                        options={locations.map((location) => ({
                          value: location.name,
                          label: `${location.name} - (${location.type.toLowerCase()})`,
                        }))}
                        placeholder={t("placeholders.startLocation")}
                        className={`w-full ${rowErrors?.startLocation ? "border-red-500" : ""}`}
                      />
                      {rowErrors?.startLocation && (
                        <p className="text-red-500 text-xs mt-1">
                          {rowErrors.startLocation}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => onOpenWagonModal("add", row.id, "first")}
                        className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-[#4CD04C1A] text-green-800 hover:bg-[#4CD04C33] cursor-pointer"
                        title={t("tooltips.addWagons")}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium min-w-[3rem] text-center lowercase">
                        {(() => {
                          const firstWagons = row.selectWagon || [];
                          return firstWagons.length > 0
                            ? getWagonTypeDisplay(firstWagons)
                            : "0";
                        })()}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWagonModal("remove", row.id, "first")
                        }
                        className="w-8 h-8 rounded flex items-center justify-center transition-colors bg-[#4CD04C1A] text-green-800 hover:bg-[#4CD04C33] cursor-pointer"
                        title={t("tooltips.removeWagons")}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <SMSCombobox
                      value={row.selectPurpose}
                      onValueChange={(value) =>
                        handlePurposeChange(
                          row.id,
                          value,
                          row.selectWagon || []
                        )
                      }
                      options={purposeOptions}
                      placeholder={t("placeholders.purpose")}
                      className="w-full"
                    />
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <div className="space-y-2">
                      {isOrdersEnabled ? (
                        <div className="flex flex-col items-center gap-2">
                          {row.orders && row.orders.length > 0 ? (
                            <>
                              <p className="text-sm text-gray-700 flex-1 whitespace-nowrap">
                                {(() => {
                                  const selectedOrder = orders.find(
                                    (o) => o.id.toString() === row.orders?.[0]
                                  );
                                  return t("orders.summary", {
                                    orderId: row.orders[0],
                                    wagonType:
                                      selectedOrder?.type_of_wagon ||
                                      t("orders.unknownType"),
                                    wagons: selectedOrder?.no_of_wagons || 0,
                                  });
                                })()}
                              </p>
                              <button
                                onClick={() => onOpenOrderModal(row.id)}
                                className={`bg-[#3E8258] hover:bg-[#3E8258]/90 whitespace-nowrap text-white px-6 py-3 rounded-full text-sm ${rowErrors?.orders ? "border-2 border-red-500" : ""}`}
                                type="button"
                                title={t("orders.changeOrder")}
                              >
                                {t("orders.changeOrder")}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onOpenOrderModal(row.id)}
                              className={`bg-[#3E8258] hover:bg-[#3E8258]/90 whitespace-nowrap text-white px-4 py-3 rounded-full text-sm flex items-center gap-2 ${rowErrors?.orders ? "border-2 border-red-500" : ""}`}
                              type="button"
                              title={t("orders.selectFromCalendar")}
                            >
                              {t("orders.selectFromCalendar")}
                            </button>
                          )}
                          {rowErrors?.orders && (
                            <p className="text-red-500 text-xs mt-1 text-center">
                              {rowErrors.orders}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic whitespace-nowrap">
                          {t("orders.onlyForSupplying", {
                            purpose: t("purposes.Supplying"),
                          })}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <div>
                      <SMSCombobox
                        value={row.arrivalLocation}
                        onValueChange={(value) =>
                          onUpdateRow(row.id, "arrivalLocation", value)
                        }
                        options={locations.map((location) => ({
                          value: location.name,
                          label: `${location.name} -  (${location.type.toLowerCase()})`,
                        }))}
                        placeholder={t("placeholders.arrivalLocation")}
                        className={`w-full ${rowErrors?.arrivalLocation ? "border-red-500" : ""}`}
                      />
                      {rowErrors?.arrivalLocation && (
                        <p className="text-red-500 text-xs mt-1">
                          {rowErrors.arrivalLocation}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="border-b border-gray-300 px-4 py-2">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWagonModal("add", row.id, "second")
                        }
                        disabled={isSecondWagonPlusDisabled}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          isSecondWagonPlusDisabled
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#4CD04C1A] text-green-800 hover:bg-[#4CD04C33] cursor-pointer"
                        }`}
                        title={
                          !isPurposeSelected
                            ? t("tooltips.selectPurposeFirst")
                            : isSecondWagonPlusDisabled
                              ? t("tooltips.cannotAddWagons")
                              : t("tooltips.addWagons")
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium min-w-[3rem] text-center lowercase">
                        {(() => {
                          const secondWagons = row.selectSecondWagon || [];
                          return secondWagons.length > 0
                            ? getWagonTypeDisplay(secondWagons)
                            : "0";
                        })()}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenWagonModal("remove", row.id, "second")
                        }
                        disabled={!isPurposeSelected}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          isPurposeSelected
                            ? "bg-[#4CD04C1A] text-green-800 hover:bg-[#4CD04C33] cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          !isPurposeSelected
                            ? t("tooltips.selectPurposeFirst")
                            : t("tooltips.removeWagons")
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2 min-w-[200px]">
                    <div>
                      <SMSInput
                        value={row.train_no || ""}
                        onChange={(e) =>
                          onUpdateRow(row.id, "train_no", e.target.value)
                        }
                        placeholder={t("placeholders.trainNo")}
                        required
                        className={`w-full ${rowErrors?.train_no ? "border-red-500" : ""}`}
                      />
                      {rowErrors?.train_no && (
                        <p className="text-red-500 text-xs mt-1">
                          {rowErrors.train_no}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2 text-center">
                    {row.startLocation &&
                    row.selectWagon &&
                    row.selectWagon.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadLocationPDF(row, "start")}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group"
                        title={t("tooltips.downloadStartDoc")}
                      >
                        <FileText className="h-5 w-5" />
                        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2 text-center">
                    {row.arrivalLocation &&
                    ((row.selectSecondWagon &&
                      row.selectSecondWagon.length > 0) ||
                      (row.selectWagon && row.selectWagon.length > 0)) ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadLocationPDF(row, "end")}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors group"
                        title={t("tooltips.downloadEndDoc")}
                      >
                        <FileText className="h-5 w-5" />
                        <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    {routePlanning.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoveRow(row.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-6 w-6" />
                      </button>
                    )}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2"></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoutePlanningTable;

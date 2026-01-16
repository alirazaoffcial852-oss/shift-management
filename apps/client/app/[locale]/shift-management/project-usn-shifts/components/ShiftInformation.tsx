"use client";

import React, { useEffect, useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { useProjectUSNShift } from "@/hooks/projectUsnShifts/useProjectUSNShift";
import RoutePlanningTable from "./RoutePlanningTable";
import DocumentUpload from "./DocumentUpload";
import WagonModal from "./WagonModal";
import { Switch } from "@workspace/ui/components/switch";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { ProjectUSNPersonalDetail } from "./ProjectUSNPersonalDetail";
import { ShiftHandoverModal } from "./ShiftHandoverModal";
import { OrderSelectionModal } from "./OrderSelectionModal";
import { ProjectUSNShift } from "@/types/projectUsn";
import { Order } from "@/types/order";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface ShiftInformationProps {
  selectedDate?: string | null;
  returnTo?: string;
  editMode?: boolean;
  shiftId?: number;
  existingShift?: any;
  disableRoutePlanning?: boolean;
}

const ShiftInformation = ({
  selectedDate,
  returnTo,
  editMode = false,
  shiftId,
  existingShift,
  disableRoutePlanning = false,
}: ShiftInformationProps) => {
  const t = useTranslations("pages.projectUsn.shiftInformation");
  const tShift = useTranslations("pages.shift");

  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentOrderRowId, setCurrentOrderRowId] = useState<string>("");

  const {
    formData,
    errors,
    wagons,
    products,
    locomotives,
    selectedProduct,
    wagonModalOpen,
    selectedWagonModalType,
    selectedWagonType,
    currentRowId,
    wagonFilters,
    loading,
    isSubmitting,
    handleInputChange,
    addRoutePlanningRow,
    updateRoutePlanningRow,
    removeRoutePlanningRow,
    openWagonModal,
    closeWagonModal,
    handleWagonSelection,
    handleWagonFilterChange,
    fetchWagons,
    handleProductChange,
    handleFileUpload,
    removeDocument,
    removeExistingDocument,
    existingDocuments,
    handleSubmit,
    orders,
    locations,
    handleProductSearch,
    getCurrentRowWagons,
    personalDetailErrors,
    warehouseLocations,
    handleShiftHandover,
  } = useProjectUSNShift(returnTo, editMode, shiftId, existingShift);

  useEffect(() => {
    fetchWagons();
  }, [fetchWagons]);

  useEffect(() => {
    if (selectedDate) {
      handleInputChange("startDate", selectedDate);
      const startDate = new Date(selectedDate);
      if (!isNaN(startDate.getTime())) {
        const sameDayFormatted = format(startDate, "yyyy-MM-dd");
        handleInputChange("endDate", sameDayFormatted);
      }
    }
  }, [selectedDate, handleInputChange]);

  const handleHandoverShift = (shift: ProjectUSNShift) => {
    handleShiftHandover(shift);
    setIsHandoverModalOpen(false);
  };

  const handleOpenOrderModal = (rowId: string) => {
    setCurrentOrderRowId(rowId);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setCurrentOrderRowId("");
  };

  const handleOrderSelect = (order: Order) => {
    if (currentOrderRowId) {
      updateRoutePlanningRow(currentOrderRowId, "orders", [
        order.id.toString(),
      ]);
      handleCloseOrderModal();
    }
  };

  const getShiftTitle = () => {
    if (editMode) {
      return formData.routePlanningEnabled
        ? t("titles.editProject")
        : t("titles.editWarehouse");
    }
    return t("titles.create");
  };

  return (
    <div className="min-h-screen bg-whit">
      <div className="flex items-center justify-between p-6">
        <SMSBackButton />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center flex-1">
          {getShiftTitle()}
        </h1>
        <SMSButton
          text={t("buttons.handover")}
          onClick={() => setIsHandoverModalOpen(true)}
          className="bg-[#3E8258] hover:bg-[#3E8258]/90 text-white px-6 py-3 rounded-full"
          type="button"
        />
      </div>

      <div className="px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <SMSInput
                label={tShift("startDate")}
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
                error={errors.startDate}
                className="w-full"
                disabled={!!selectedDate || editMode}
              />
              {selectedDate && (
                <div className="absolute -top-2 right-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {t("badges.selectedFromCalendar")}
                </div>
              )}
              {editMode && (
                <div className="absolute -top-2 right-0 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {t("badges.dateLocked")}
                </div>
              )}
            </div>
            <div className="relative">
              <SMSInput
                label={tShift("endDate")}
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
                error={errors.endDate}
                className="w-full"
                disabled={!!selectedDate || editMode}
              />
              {selectedDate && (
                <div className="absolute -top-2 right-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {t("badges.selectedFromCalendar")}
                </div>
              )}
              {editMode && !selectedDate && (
                <div className="absolute -top-2 right-0 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {t("badges.singleShift")}
                </div>
              )}
            </div>
            <SMSInput
              label={tShift("startTime")}
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              required
              error={errors.startTime}
              className="w-full"
            />
            <SMSInput
              label={tShift("endTime")}
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              required
              error={errors.endTime}
              className="w-full"
            />
          </div>

          <div className="flex justify-center gap-4 flex-col lg:flex-row">
            <SMSCombobox
              label={tShift("product")}
              placeholder={tShift("selectProduct")}
              searchPlaceholder={tShift("searchProducts")}
              value={formData.productId}
              onValueChange={handleProductChange}
              options={products.map((product) => ({
                value: product.id?.toString() || "",
                label: product.name,
              }))}
              required
              error={errors.productId}
              onSearch={handleProductSearch}
              className="w-full"
            />
            <SMSCombobox
              label={tShift("locomotive")}
              placeholder={tShift("selectLocomotive")}
              searchPlaceholder={t("combobox.searchLocomotive")}
              value={formData.locomotiveId || ""}
              onValueChange={(value) =>
                handleInputChange("locomotiveId", value)
              }
              options={locomotives}
              required
              error={errors.locomotiveId}
              loading={loading.locomotives}
              className="w-full"
            />
            {!formData.routePlanningEnabled && (
              <SMSCombobox
                label={t("warehouseLocation.label")}
                placeholder={t("warehouseLocation.placeholder")}
                searchPlaceholder={t("warehouseLocation.searchPlaceholder")}
                value={formData.warehouseLocation || ""}
                onValueChange={(value) =>
                  handleInputChange("warehouseLocation", value)
                }
                options={warehouseLocations.map((location) => ({
                  value: location.id.toString(),
                  label: `${location.name} (${location.type.toLowerCase()}) - ${location.location}`,
                }))}
                required
                error={errors.warehouseLocation}
                className="w-full"
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-4 mb-4 min-w-max">
              <Label className="text-lg font-semibold text-[#3E8258]">
                {t("routePlanning.title")}
              </Label>
              <Switch
                checked={formData.routePlanningEnabled}
                onCheckedChange={(enabled) =>
                  handleInputChange("routePlanningEnabled", enabled)
                }
                disabled={disableRoutePlanning}
              />
              <p className="text-[10px] font-semibold">
                {disableRoutePlanning
                  ? t("routePlanning.notAvailable")
                  : t("showDetails")}
              </p>
            </div>
            {disableRoutePlanning && (
              <p className="text-sm text-gray-600 italic">
                {t("routePlanning.onlyAvailable")}
              </p>
            )}
          </div>

          {formData.routePlanningEnabled && (
            <RoutePlanningTable
              routePlanning={formData.routePlanning}
              onAddRow={addRoutePlanningRow}
              onRemoveRow={removeRoutePlanningRow}
              onUpdateRow={updateRoutePlanningRow}
              onOpenWagonModal={openWagonModal}
              onOpenOrderModal={handleOpenOrderModal}
              orders={orders}
              locations={locations}
              wagons={wagons}
              errors={errors.routePlanningErrors}
            />
          )}

          {selectedProduct?.productPersonnelPricings && (
            <ProjectUSNPersonalDetail
              formData={formData}
              onUpdate={handleInputChange}
              errors={personalDetailErrors}
              product={selectedProduct}
            />
          )}

          <div className="space-y-4">
            <div className="flex flex-row items-center space-x-4 mb-4 min-w-max">
              <Label className="text-lg font-semibold text-[#3E8258]">
                {t("shiftNote.title")}
              </Label>
              <Switch
                checked={formData.hasNote}
                onCheckedChange={(enabled) =>
                  handleInputChange("hasNote", enabled)
                }
              />
              <p className="text-[10px] font-semibold">{t("showDetails")}</p>
            </div>

            {formData.hasNote && (
              <div className="space-y-2">
                <Label
                  htmlFor="shift-note"
                  className="text-[16px] font-medium text-[#2D2E33]"
                >
                  {t("shiftNote.label")}
                </Label>
                <Textarea
                  required
                  id="shift-note"
                  value={formData.note || ""}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  placeholder={t("shiftNote.placeholder")}
                  className="min-h-[100px]"
                />
                {errors.note && (
                  <p className="text-sm text-red-500">{errors.note}</p>
                )}
              </div>
            )}
          </div>

          <DocumentUpload
            documents={formData.documents}
            onFileUpload={handleFileUpload}
            onRemoveDocument={removeDocument}
            existingDocuments={existingDocuments}
            onRemoveExistingDocument={removeExistingDocument}
          />

          <div className="flex justify-end py-20">
            <SMSButton
              type="submit"
              text={
                isSubmitting
                  ? editMode
                    ? t("buttons.updating")
                    : t("buttons.creating")
                  : editMode
                    ? t("buttons.update")
                    : t("buttons.add")
              }
              disabled={isSubmitting}
              className="bg-black text-white px-8 py-3 rounded-full disabled:opacity-50"
            />
          </div>
        </form>
      </div>

      <WagonModal
        isOpen={wagonModalOpen}
        onClose={closeWagonModal}
        modalType={selectedWagonModalType}
        wagonType={selectedWagonType}
        wagons={wagons}
        selectedWagonIds={getCurrentRowWagons(currentRowId)}
        filters={wagonFilters}
        onFilterChange={handleWagonFilterChange}
        onWagonSelection={handleWagonSelection}
        currentPurpose={
          formData.routePlanning.find((r) => r.id === currentRowId)
            ?.selectPurpose
        }
        pickupDate={
          formData.routePlanning.find((r) => r.id === currentRowId)?.pickup_date
        }
        onPickupDateChange={(date) => {
          if (currentRowId) {
            updateRoutePlanningRow(currentRowId, "pickup_date", date);
          }
        }}
      />

      <ShiftHandoverModal
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        onSelectShift={handleHandoverShift}
      />

      <OrderSelectionModal
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        onSelectOrder={handleOrderSelect}
        selectedOrderId={
          currentOrderRowId
            ? formData.routePlanning.find((r) => r.id === currentOrderRowId)
                ?.orders?.[0]
            : undefined
        }
      />
    </div>
  );
};

export default ShiftInformation;

"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { WagonFilters, WagonOption } from "@/types/projectUsn";
import { useTranslations } from "next-intl";
import { useWagonPagination } from "./hooks/useWagonPagination";
import { useWagonFilterOptions } from "./hooks/useWagonFilterOptions";
import { WagonFiltersSection } from "./components/WagonFilters";
import { WagonTable } from "./components/WagonTable";
import { PickupDateSection } from "./components/PickupDateSection";

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
  wagons: initialWagons,
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

  const { allWagons, loadingMore, scrollContainerRef } = useWagonPagination({
    initialWagons,
    filters,
    isOpen,
  });

  const { statusOptions, statusLabelMap, wagonTypeOptions, railOptions } =
    useWagonFilterOptions();

  const showPickupDate =
    wagonType === "second" && currentPurpose === "Supplying";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t(`titles.${modalType}.${wagonType}`)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pb-4">
          <WagonFiltersSection
            filters={filters}
            onFilterChange={onFilterChange}
            statusOptions={statusOptions}
            wagonTypeOptions={wagonTypeOptions}
            railOptions={railOptions}
            t={t}
          />

          <WagonTable
            wagons={allWagons}
            modalType={modalType}
            selectedWagonIds={selectedWagonIds}
            onWagonSelection={onWagonSelection}
            statusLabelMap={statusLabelMap}
            loadingMore={loadingMore}
            scrollContainerRef={scrollContainerRef}
            t={t}
          />
        </div>

        {showPickupDate && (
          <PickupDateSection
            pickupDate={pickupDate}
            onPickupDateChange={onPickupDateChange}
            t={t}
          />
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

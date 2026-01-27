"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import { useTranslations } from "next-intl";
import LocationService from "@/services/location";
import { useCompany } from "@/providers/appProvider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { SMSTableSkeleton } from "@workspace/ui/components/custom/SMSTable/Skeleton";

interface ImportOrderInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

interface LocationItem {
  id: number;
  name: string;
  location: string;
  type: string;
}

const ImportOrderInfoDialog = ({ open, onClose }: ImportOrderInfoDialogProps) => {
  const t = useTranslations("common");
  const { company } = useCompany();
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchLocations = async () => {
      if (!company?.id || !open) return;
      setLoading(true);
      try {
        const response = await LocationService.getAllLocations(
          currentPage,
          pageSize,
          company.id
        );
        const data = response?.data?.data || [];
        setLocations(data);
        if (response?.data?.pagination?.total_pages) {
          setTotalPages(response.data.pagination.total_pages);
        } else {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [company?.id, open, currentPage]);

  useEffect(() => {
    if (open) {
      setCurrentPage(1);
    }
  }, [open]);

  const formatType = (type: string) => {
    if (type === "SUPPLIER_PLANT") {
      return t("supplier_plant_label");
    }
    if (type === "TARIF_POINT" || type === "TARIFF_POINT") {
      return t("tariff_point");
    }
    return type;
  };

  const sampleRow = {
    supplier_id: "110",
    tariff_id: "95",
    delivery_date: "2026-01-25",
    type_of_wagon: "EAOS",
    no_of_wagons: "10",
    tonnage: "10",
    distance_in_km: "10",
    return_schedule: "2026-01-27",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1100px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            {t("import_order_help_title")}
          </h2>

          <div className="space-y-3">
            <h3 className="font-medium">
              {t("import_order_format_title")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("drag_drop_or_click_upload")}
            </p>
            <div className="w-full overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_supplier_id")}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_tariff_id")}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_delivery_date")}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_type_of_wagon")}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_no_of_wagons")}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_tonnage")}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_distance_in_km")}
                    </th>
                    <th className="px-3 py-2 text-left">
                      {t("import_order_header_return_schedule")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-3 py-2">{sampleRow.supplier_id}</td>
                    <td className="px-3 py-2">{sampleRow.tariff_id}</td>
                    <td className="px-3 py-2">{sampleRow.delivery_date}</td>
                    <td className="px-3 py-2">{sampleRow.type_of_wagon}</td>
                    <td className="px-3 py-2">{sampleRow.no_of_wagons}</td>
                    <td className="px-3 py-2">{sampleRow.tonnage}</td>
                    <td className="px-3 py-2">{sampleRow.distance_in_km}</td>
                    <td className="px-3 py-2">{sampleRow.return_schedule}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">
              {t("import_order_locations_title")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("import_order_locations_description")}
            </p>
            <div className="w-full overflow-x-auto border rounded-lg">
              {loading ? (
                <SMSTableSkeleton columns={4} rows={10} showSearch={false} showActions={false} className="min-w-full" />
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">
                        {t("import_order_locations_id")}
                      </th>
                      <th className="px-3 py-2 text-left">{t("location_name")}</th>
                      <th className="px-3 py-2 text-left">{t("location")}</th>
                      <th className="px-3 py-2 text-left">{t("type_of_location")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((loc) => (
                      <tr key={loc.id} className="border-t">
                        <td className="px-3 py-2">{loc.id}</td>
                        <td className="px-3 py-2">{loc.name}</td>
                        <td className="px-3 py-2">{loc.location}</td>
                        <td className="px-3 py-2">{formatType(loc.type)}</td>
                      </tr>
                    ))}
                    {locations.length === 0 && !loading && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-4 text-center text-sm text-gray-500"
                        >
                          {t("no_order_found")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-end pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-3 text-sm text-gray-700">
                        {currentPage} / {totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((prev) =>
                            prev < totalPages ? prev + 1 : prev
                          );
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportOrderInfoDialog;


"use client";

import React, { useState, useRef } from "react";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import { Upload, X, Paperclip } from "lucide-react";
import { toast } from "sonner";
import OrderService from "@/services/order.service";
import { CreateOrderData } from "@/types/order";
import { useTranslations } from "next-intl";

interface ImportOrderDialogProps {
  open: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

interface UploadedFile {
  file: File;
  preview: string;
}

const ImportOrderDialog = ({
  open,
  onClose,
  onImportSuccess,
}: ImportOrderDialogProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<CreateOrderData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("common");
  const tactions = useTranslations("actions");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const parseCSVFile = (file: File): Promise<CreateOrderData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const lines = csvText.split("\n");

          if (lines.length < 2) {
            reject(new Error(t("csv_missing_header")));
            return;
          }

          if (!lines[0]) {
            reject(new Error(t("csv_missing_header_row")));
            return;
          }
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().toLowerCase());
          const expectedHeaders = [
            "supplier_id",
            "tariff_id",
            "delivery_date",
            "type_of_wagon",
            "no_of_wagons",
            "tonnage",
            "distance_in_km",
            "return_schedule",
            "date",
          ];

          const missingHeaders = expectedHeaders.filter(
            (header) => !headers.includes(header)
          );
          if (missingHeaders.length > 0) {
            reject(
              new Error(
                t("missing_required_columns", {
                  columns: missingHeaders.join(", "),
                })
              )
            );
            return;
          }

          const orders: CreateOrderData[] = [];

          for (let i = 1; i < lines.length; i++) {
            const rawLine = lines[i];
            if (typeof rawLine !== "string") continue;
            const line = rawLine.trim();
            if (!line) continue;

            const values = line.split(",").map((v) => v.trim());

            const order: CreateOrderData = {
              supplier_id:
                parseInt(values[headers.indexOf("supplier_id")] ?? "") || 0,
              tariff_id:
                parseInt(values[headers.indexOf("tariff_id")] ?? "") || 0,
              delivery_date:
                values[headers.indexOf("delivery_date")] ??
                new Date().toISOString(),
              type_of_wagon: values[headers.indexOf("type_of_wagon")] ?? "FACS",
              no_of_wagons:
                parseInt(values[headers.indexOf("no_of_wagons")] ?? "") || 0,
              tonnage: parseInt(values[headers.indexOf("tonnage")] ?? "") || 0,
              distance_in_km:
                parseInt(values[headers.indexOf("distance_in_km")] ?? "") || 0,
              return_schedule: values[headers.indexOf("return_schedule")] ?? "",
            };

            if (order.supplier_id && order.tariff_id && order.type_of_wagon) {
              orders.push(order);
            }
          }

          resolve(orders);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error(t("failed_to_read_file")));
      reader.readAsText(file);
    });
  };

  const handleFiles = async (fileList: FileList) => {
    const newFiles: UploadedFile[] = [];
    let allParsedData: CreateOrderData[] = [];

    for (const file of Array.from(fileList)) {
      if (
        file.type !== "text/csv" &&
        !file.name.toLowerCase().endsWith(".csv")
      ) {
        toast.error(t("file_not_supported", { name: file.name }));
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("file_too_large", { name: file.name }));
        continue;
      }

      try {
        const parsedOrders = await parseCSVFile(file);
        allParsedData = [...allParsedData, ...parsedOrders];

        const uploadedFile: UploadedFile = {
          file,
          preview: URL.createObjectURL(file),
        };

        newFiles.push(uploadedFile);
      } catch (error) {
        toast.error(
          t("failed_to_parse_file", {
            name: file.name,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        );
        console.error("Parse error:", error);
      }
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setParsedData((prev) => [...prev, ...allParsedData]);

    if (allParsedData.length > 0) {
      toast.success(
        t("successfully_parsed_orders", {
          count: allParsedData.length.toString(),
          files: newFiles.length.toString(),
        })
      );
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index]?.preview!!);
      newFiles.splice(index, 1);
      return newFiles;
    });

    if (files.length > 1) {
      const remainingFiles = files.filter((_, i) => i !== index);
      setParsedData([]);
      remainingFiles.forEach(async (fileObj) => {
        try {
          const parsedOrders = await parseCSVFile(fileObj.file);
          setParsedData((prev) => [...prev, ...parsedOrders]);
        } catch (error) {
          console.error("Re-parse error:", error);
        }
      });
    } else {
      setParsedData([]);
    }
  };

  const handleImport = async () => {
    if (files.length === 0) {
      toast.error(t("please_select_file"));
      return;
    }

    if (parsedData.length === 0) {
      toast.error(t("no_valid_orders"));
      return;
    }

    setIsUploading(true);

    try {
      const response = await OrderService.createOrder(parsedData);

      if (response) {
        toast.success(
          t("successfully_imported", { count: parsedData.length.toString() })
        );
        if (onImportSuccess) {
          await onImportSuccess();
        }
        handleClose();
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error(t("failed_to_import"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
    setFiles([]);
    setParsedData([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1100px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold ">
                {t("upload_order")} <span className="text-red-500">*</span>
              </h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 transition-colors ${dragActive ? "border-primary bg-[#3E82582E]" : " border-gray-300 bg-gray-50"}`}
              style={{
                borderStyle: "dashed",
                borderWidth: "2px",
                borderSpacing: "10px",
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#3E82582E] rounded-lg flex items-center justify-center">
                    <Paperclip className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[#818285] font-medium">
                      {t("drag_drop_or_click_upload")}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("expected_columns")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-4 bg-[#3E82582E] text-primary rounded-2xl flex items-center space-x-2 hover:bg-primary hover:text-white transition-colors font-medium"
                >
                  <Upload className="h-4 w-4" />
                  <span>{t("upload_file")}</span>
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              multiple
            />
          </div>

          {/* Show uploaded files */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">{t("uploaded_files")}</h3>
              {files.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      {fileObj.file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Show parsed data summary */}
          {parsedData.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">{t("parsed_orders")}</h3>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  {t("successfully_parsed")}{" "}
                  <strong>{parsedData.length}</strong> {t("orders_from_files")}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 ">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-primary font-medium hover:text-primary transition-colors"
              disabled={isUploading}
            >
              {tactions("cancel")}
            </button>
            <button
              onClick={handleImport}
              disabled={
                files.length === 0 || parsedData.length === 0 || isUploading
              }
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading
                ? t("importing")
                : t("import_orders", { count: parsedData.length.toString() })}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportOrderDialog;

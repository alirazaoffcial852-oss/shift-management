"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";

interface ExcelDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
}

interface Cell {
  value: string;
}

interface Row {
  id: string;
  cells: Cell[];
}

const ExcelDocumentDialog: React.FC<ExcelDocumentDialogProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const t = useTranslations("timesheet");
  const [rows, setRows] = useState<Row[]>([
    {
      id: "1",
      cells: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
    },
  ]);
  const [headers, setHeaders] = useState<string[]>([
    "Column 1",
    "Column 2",
    "Column 3",
    "Column 4",
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addRow = () => {
    const newRow: Row = {
      id: `row-${Date.now()}`,
      cells: headers.map(() => ({ value: "" })),
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (rowId: string) => {
    if (rows.length > 1) {
      setRows(rows.filter((row) => row.id !== rowId));
    } else {
      toast.error("At least one row is required");
    }
  };

  const addColumn = () => {
    const newHeader = `Column ${headers.length + 1}`;
    setHeaders([...headers, newHeader]);
    setRows(
      rows.map((row) => ({
        ...row,
        cells: [...row.cells, { value: "" }],
      }))
    );
  };

  const removeColumn = (columnIndex: number) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((_, index) => index !== columnIndex));
      setRows(
        rows.map((row) => ({
          ...row,
          cells: row.cells.filter((_, index) => index !== columnIndex),
        }))
      );
    } else {
      toast.error("At least one column is required");
    }
  };

  const updateCell = (rowId: string, cellIndex: number, value: string) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) {
          const newCells = [...row.cells];
          newCells[cellIndex] = { value };
          return { ...row, cells: newCells };
        }
        return row;
      })
    );
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const handleSave = () => {
    try {
      const wb = XLSX.utils.book_new();

      const data = [
        headers,
        ...rows.map((row) => row.cells.map((cell) => cell.value)),
      ];

      const ws = XLSX.utils.aoa_to_sheet(data);

      const colWidths = headers.map(() => ({ wch: 15 }));
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const fileName = `timesheet-document-${Date.now()}.xlsx`;

      const fileBuffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([fileBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const file = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      onSave(file);
      toast.success("Excel document saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving Excel file:", error);
      toast.error("Failed to save Excel document");
    }
  };

  const handleLoadExcel = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0] ?? ""];
          if (!firstSheet) {
            throw new Error("No valid sheet found in the Excel file.");
          }
          const jsonData = XLSX.utils.sheet_to_json(
            firstSheet as unknown as XLSX.WorkSheet,
            {
              header: 1,
              defval: "",
            }
          );

          if (jsonData.length > 0) {
            const loadedHeaders = (jsonData[0] as string[]).map((h) =>
              String(h || `Column ${headers.length + 1}`)
            );

            const loadedRows: Row[] = (jsonData.slice(1) as any[]).map(
              (row, index) => ({
                id: `row-${Date.now()}-${index}`,
                cells: row.map((cell: any) => ({ value: String(cell || "") })),
              })
            );

            const normalizedRows = loadedRows.map((row) => {
              const cells = [...row.cells];
              while (cells.length < loadedHeaders.length) {
                cells.push({ value: "" });
              }
              return { ...row, cells: cells.slice(0, loadedHeaders.length) };
            });

            setHeaders(loadedHeaders);
            setRows(
              normalizedRows.length > 0
                ? normalizedRows
                : [{ id: "1", cells: loadedHeaders.map(() => ({ value: "" })) }]
            );
            toast.success("Excel file loaded successfully");
          }
        } catch (error) {
          console.error("Error parsing Excel file:", error);
          toast.error("Failed to load Excel file");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error reading file:", error);
      toast.error("Failed to read Excel file");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx")
      ) {
        handleLoadExcel(file);
      } else {
        toast.error("Please select a valid Excel (.xlsx) file");
      }
    }
  };

  const handleReset = () => {
    setHeaders(["Column 1", "Column 2", "Column 3", "Column 4"]);
    setRows([
      {
        id: "1",
        cells: [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogTitle className="text-2xl font-semibold mb-4">
          Create Timesheet Excel Document
        </DialogTitle>

        <div className="flex-1 overflow-auto">
          <div className="mb-4 flex gap-2 items-center">
            <SMSButton
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="text-sm"
            >
              Load Excel File
            </SMSButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileInput}
              className="hidden"
            />
            <SMSButton
              onClick={addRow}
              variant="outline"
              className="text-sm flex items-center gap-2"
            >
              Add Row
            </SMSButton>
            <SMSButton
              onClick={addColumn}
              variant="outline"
              className="text-sm flex items-center gap-2"
            >
              Add Column
            </SMSButton>
            <SMSButton
              onClick={handleReset}
              variant="outline"
              className="text-sm"
            >
              Reset
            </SMSButton>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-auto max-h-[60vh]">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="border border-gray-300 px-2 py-2 bg-gray-200 min-w-[50px] text-center font-semibold">
                    #
                  </th>
                  {headers.map((header, colIndex) => (
                    <th
                      key={colIndex}
                      className="border border-gray-300 px-4 py-2 bg-gray-200 min-w-[150px]"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={header}
                          onChange={(e) =>
                            updateHeader(colIndex, e.target.value)
                          }
                          className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                          placeholder={`Column ${colIndex + 1}`}
                        />
                        {headers.length > 1 && (
                          <button
                            onClick={() => removeColumn(colIndex)}
                            className="ml-2 text-red-500 hover:text-red-700"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="border border-gray-300 px-2 py-2 bg-gray-200 min-w-[50px] text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={row.id}>
                    <td className="border border-gray-300 px-2 py-2 text-center bg-gray-50 font-medium">
                      {rowIndex + 1}
                    </td>
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-2 py-2 bg-white"
                      >
                        <input
                          type="text"
                          value={cell.value}
                          onChange={(e) =>
                            updateCell(row.id, cellIndex, e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Enter value..."
                        />
                      </td>
                    ))}
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {rows.length > 1 && (
                        <button
                          onClick={() => removeRow(row.id)}
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4 pt-4 border-t">
          <SMSButton variant="outline" onClick={onClose}>
            Cancel
          </SMSButton>
          <SMSButton
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            Save Excel Document
          </SMSButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelDocumentDialog;

"use client";
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { SupplierPlantColumn } from "@/types/project-usn-product";
import { useTranslations } from "next-intl";

interface SupplierPlantTableProps {
  columns: SupplierPlantColumn[];
  setColumns: React.Dispatch<React.SetStateAction<SupplierPlantColumn[]>>;
}

const SupplierPlantTable: React.FC<SupplierPlantTableProps> = ({
  columns,
  setColumns,
}) => {
  const t = useTranslations("pages.products");
  const createRow = () => ({
    id: `row-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    distance: "",
    costPerTon: "",
  });

  const handleAddRow = () => {
    const newRowId = `row-${Date.now()}`;
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        rows: [...column.rows, { id: newRowId, distance: "", costPerTon: "" }],
      }))
    );
  };

  const handleAddColumn = () => {
    const newColumnId = `supplier-${Date.now()}`;
    const newColumn: SupplierPlantColumn = {
      id: newColumnId,
      label: t("supplierPlant"),
      tonnage: "",
      rows: columns[0]?.rows.map((row) => ({
        id: `${newColumnId}-${row.id}`,
        distance: row.distance || "",
        costPerTon: "",
      })) || [createRow()],
    };
    setColumns((prevColumns) => [...prevColumns, newColumn]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (columns[0]?.rows.length && columns[0]?.rows.length > 1) {
      setColumns((prevColumns) =>
        prevColumns.map((column) => ({
          ...column,
          rows: column.rows.filter((_, index) => index !== rowIndex),
        }))
      );
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (columns.length > 1) {
      setColumns((prevColumns) =>
        prevColumns.filter((column) => column.id !== columnId)
      );
    }
  };

  const handleTonnageChange = (columnId: string, value: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, tonnage: value } : column
      )
    );
  };

  const handleInputChange = (
    columnId: string,
    rowId: string,
    field: "distance" | "costPerTon",
    value: string
  ) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              rows: column.rows.map((row) =>
                row.id === rowId ? { ...row, [field]: value } : row
              ),
            }
          : column
      )
    );
  };

  const handleDistanceChange = (rowIndex: number, value: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        rows: column.rows.map((row, index) =>
          index === rowIndex ? { ...row, distance: value } : row
        ),
      }))
    );
  };

  React.useEffect(() => {
    if (columns.length === 0) {
      const defaultColumn: SupplierPlantColumn = {
        id: `supplier-${Date.now()}`,
        label: t("supplierPlant"),
        tonnage: "",
        rows: [createRow()],
      };
      setColumns([defaultColumn]);
      return;
    }

    if (columns.some((column) => column.rows.length === 0)) {
      setColumns((prevColumns) =>
        prevColumns.map((column) =>
          column.rows.length === 0 ? { ...column, rows: [createRow()] } : column
        )
      );
    }
  }, [columns, setColumns]);

  const rows = columns[0]?.rows ?? [];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("supplierPlant")}
          </h3>
          <div className="border-b-2 border-dotted border-gray-300"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left w-64">
                  <span className="text-sm font-medium text-gray-700">
                    {t("supplierPlant")}
                  </span>
                </th>
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className="border border-gray-200 px-4 py-3 text-center relative"
                  >
                    <div className="flex items-center justify-start space-x-2">
                      <span className="text-sm text-gray-600">
                        {t("tonnageUnit")}
                      </span>
                      <input
                        type="text"
                        value={column.tonnage}
                        onChange={(e) =>
                          handleTonnageChange(column.id, e.target.value)
                        }
                        className="w-24 px-3 py-2 text-sm text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="e.g. 12"
                      />
                    </div>

                    {columns.length > 1 && (
                      <button
                        onClick={() => handleDeleteColumn(column.id)}
                        className="absolute top-1 right-0 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                        title={t("deleteColumn")}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((_, rowIndex) => {
                const firstColumnRow = columns[0]?.rows?.[rowIndex] || {
                  id: "",
                  distance: "",
                  costPerTon: "",
                };
                return (
                  <tr key={`row-${rowIndex}`} className="bg-white">
                    <td className="border border-gray-200 px-4 py-4 align-top">
                      <div className="flex items-center space-x-2">
                        <span>{t("distanceAndCost")}:</span>

                        <input
                          type="text"
                          value={firstColumnRow?.distance || ""}
                          onChange={(e) =>
                            handleDistanceChange(rowIndex, e.target.value)
                          }
                          className="w-32 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder={t("distancePlaceholder")}
                        />
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                          {t("km")}
                        </span>
                        {rows.length > 1 && (
                          <button
                            onClick={() => handleDeleteRow(rowIndex)}
                            className="ml-4 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-sm"
                            title={t("deleteRow")}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    {columns.map((column) => {
                      const row = column.rows?.[rowIndex] || {
                        id: "",
                        distance: "",
                        costPerTon: "",
                      };
                      return (
                        <td
                          key={`${column.id}-row-${rowIndex}`}
                          className="border border-gray-200 px-4 py-4 align-top"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700 whitespace-nowrap">
                              {t("costPerTon")}
                            </span>
                            <input
                              type="text"
                              value={row?.costPerTon || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  column.id,
                                  row?.id || "",
                                  "costPerTon",
                                  e.target.value
                                )
                              }
                              className="w-32 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="e.g. 12"
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td
                    className="border border-gray-200 px-4 py-6 text-sm text-gray-500 text-center"
                    colSpan={columns.length + 2}
                  >
                    {t("noRowsAvailable")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex space-x-4 justify-between mt-4">
          <button
            onClick={handleAddRow}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t("addRow")}</span>
          </button>
          <button
            onClick={handleAddColumn}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t("addColumn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierPlantTable;

"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { ProjectUsnProduct } from "@/types/project-usn-product";

interface ProductMatrixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProjectUsnProduct;
}

const ProductMatrixDialog: React.FC<ProductMatrixDialogProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const supplierPlants = product.supplier_plants || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Product Matrix
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left w-64">
                    <span className="text-sm font-medium text-gray-700">
                      Supplier Plant
                    </span>
                  </th>
                  {supplierPlants.map((plant, index) => (
                    <th
                      key={index}
                      className="border border-gray-200 px-4 py-3 text-center"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm text-gray-600">(t)</span>
                        <span className="text-sm font-medium">
                          {plant.tons}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {supplierPlants[0]?.distances.map((_, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    {/* Distance Row */}
                    <tr className="bg-white">
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700 whitespace-nowrap">
                            Distance :
                          </span>
                          <span className="text-sm font-medium">
                            {supplierPlants[0]?.distances[rowIndex]
                              ?.distance_km || 0}
                          </span>
                          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                            km
                          </span>
                        </div>
                      </td>
                      {supplierPlants.map((plant, plantIndex) => (
                        <td
                          key={`distance-${plantIndex}-${rowIndex}`}
                          className="border border-gray-200 px-4 py-3"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm text-gray-700 whitespace-nowrap">
                              €/(t):
                            </span>
                            <span className="text-sm font-medium">
                              {plant.distances[rowIndex]?.cost_per_ton || 0}
                            </span>
                            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                              km
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Cost per Ton Row */}
                    <tr className="bg-white">
                      <td className="border border-gray-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700 whitespace-nowrap">
                            Distance :
                          </span>
                          <span className="text-sm font-medium">
                            {supplierPlants[0]?.distances[rowIndex]
                              ?.distance_km || 0}
                          </span>
                          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                            km
                          </span>
                        </div>
                      </td>
                      {supplierPlants.map((plant, plantIndex) => (
                        <td
                          key={`cost-${plantIndex}-${rowIndex}`}
                          className="border border-gray-200 px-4 py-3"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-sm text-gray-700 whitespace-nowrap">
                              €/(t):
                            </span>
                            <span className="text-sm font-medium">
                              {plant.distances[rowIndex]?.cost_per_ton || 0}
                            </span>
                            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                              km
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
            <SMSButton
              onClick={() => onOpenChange(false)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md"
            >
              Go Back
            </SMSButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductMatrixDialog;

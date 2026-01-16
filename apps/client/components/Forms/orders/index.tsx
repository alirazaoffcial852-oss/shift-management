"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";
import { Plus } from "lucide-react";
import { useOrderForm } from "@/hooks/order/userOrderForm";
import { wagonTypes } from "@/types/order";

const OrderForm = () => {
  const params = useParams();

  const orderId = params?.id ? parseInt(params.id as string) : undefined;

  const {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    supplierOptions,
    tariffOptions,
    isLoadingSuppliers,
    isLoadingTariffs,
  } = useOrderForm(orderId);

  return (
    <div className="w-full min-h-screen bg-white border rounded-3xl p-4 md:p-6">
      <div className=" ">
        <div className="flex items-center mb-8">
          <SMSBackButton />
          <div className="flex flex-col items-center w-full">
            <h1 className=" text-center">
              {orderId ? "Edit Order" : "Create Order"}
            </h1>
          </div>
        </div>
        <div className=" p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <SMSCombobox
                  label="Supplier Plant"
                  placeholder="Select Supplier Plant"
                  value={formData.supplier_id.toString()}
                  onValueChange={(value) =>
                    handleInputChange("supplier_id", parseInt(value))
                  }
                  options={supplierOptions}
                  required
                  error={errors.supplier_id}
                  className="w-full"
                  disabled={isLoadingSuppliers}
                />
              </div>

              <div>
                <SMSCombobox
                  label="Delivery Tariff Point"
                  placeholder="Select Tariff Point"
                  value={formData.tariff_id.toString()}
                  onValueChange={(value) =>
                    handleInputChange("tariff_id", parseInt(value))
                  }
                  options={tariffOptions}
                  required
                  error={errors.tariff_id}
                  className="w-full"
                  disabled={isLoadingTariffs}
                />
              </div>

              <div>
                <SMSInput
                  label="Delivery Date"
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) =>
                    handleInputChange("delivery_date", e.target.value)
                  }
                  required
                  error={errors.delivery_date}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <SMSCombobox
                  label="Type of Wagons"
                  placeholder="Select Wagon Type"
                  value={formData.type_of_wagon}
                  onValueChange={(value) =>
                    handleInputChange("type_of_wagon", value)
                  }
                  options={wagonTypes}
                  required
                  error={errors.type_of_wagon}
                  className="w-full"
                />
              </div>

              <div>
                <SMSInput
                  label="No of Wagons"
                  type="number"
                  placeholder="12..."
                  value={formData.no_of_wagons.toString()}
                  onChange={(e) =>
                    handleInputChange(
                      "no_of_wagons",
                      parseInt(e.target.value) || 0
                    )
                  }
                  required
                  error={errors.no_of_wagons}
                  className="w-full"
                />
              </div>

              <div>
                <SMSInput
                  label="Tonnage"
                  type="number"
                  placeholder="12..."
                  value={formData.tonnage.toString()}
                  onChange={(e) =>
                    handleInputChange("tonnage", parseInt(e.target.value) || 0)
                  }
                  required
                  error={errors.tonnage}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <SMSInput
                  label="Distance in km"
                  type="number"
                  placeholder="12"
                  value={formData.distance_in_km.toString()}
                  onChange={(e) =>
                    handleInputChange(
                      "distance_in_km",
                      parseInt(e.target.value) || 0
                    )
                  }
                  required
                  error={errors.distance_in_km}
                  className="w-full"
                />
              </div>

              <div className="relative">
                <SMSInput
                  type="date"
                  label="Return Schedule"
                  placeholder="48 hours after Delivery Date"
                  value={formData.return_schedule}
                  onChange={(e) =>
                    handleInputChange("return_schedule", e.target.value)
                  }
                  required
                  error={errors.return_schedule}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <SMSButton
                type="submit"
                text={orderId ? "Update" : "Add"}
                startIcon={!orderId ? <Plus className="h-4 w-4" /> : undefined}
                loading={loading}
                loadingText={
                  orderId ? "Updating Order..." : "Creating Order..."
                }
                className="bg-black text-white px-8 py-3 rounded-full"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;

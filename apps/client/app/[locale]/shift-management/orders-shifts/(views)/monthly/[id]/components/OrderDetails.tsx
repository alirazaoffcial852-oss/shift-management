"use client";

import { Order } from "@/types/order";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import OrderService from "@/services/order.service";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("pages.order");

  const fetchOrder = async () => {
    if (!id) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await OrderService.getOrderById(Number(id));
      if (response) {
        setOrder(response.data);
      } else {
        throw new Error("No order data received");
      }
    } catch (err: any) {
      console.error("Error fetching order:", err);
      setError(err.message || "Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl mb-4">Error: {error}</div>
        <button
          onClick={fetchOrder}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-xl">No order found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-4">
      <div className="mx-auto">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <SMSBackButton />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 ml-4">
              Order Details
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Order ID:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Delivery Date:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.delivery_date
                    ? format(new Date(order.delivery_date), "dd/MM/yyyy")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Status:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.status || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Location Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Supplier Plant:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.supplier?.name ||
                    order.supplier?.location ||
                    order.supplier_id ||
                    "N/A"}
                </span>
              </div>
              {order.supplier?.location && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Supplier Address:</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {order.supplier.location}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  Delivery Tariff Point:
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.tariff?.name ||
                    order.tariff?.location ||
                    order.tariff_id ||
                    "N/A"}
                </span>
              </div>
              {order.tariff?.location && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Tariff Address:</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {order.tariff.location}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Distance:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.distance_in_km ? `${order.distance_in_km} km` : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Transport Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Type of Wagon:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.type_of_wagon || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Number of Wagons:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.no_of_wagons || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Tonnage:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.tonnage ? `${order.tonnage} Tons` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Return Schedule:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {order.return_schedule
                    ? format(new Date(order.return_schedule), "dd/MM/yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

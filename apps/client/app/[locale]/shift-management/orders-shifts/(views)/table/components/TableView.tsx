"use client";

import React from "react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import OrderActions from "@/components/OrderActions";
import {
  getColumns,
  getActions,
  OrderActionCallbacks,
} from "../../../components/table-essentials";
import { useOrderTable } from "@/hooks/order/userOrderTable";
import { toast } from "sonner";
import OrderService from "@/services/order.service";

const TableView = () => {
  const {
    orders,
    isLoading,
    pagination,
    handleSearch,
    removeOrder,
    fetchOrders,
  } = useOrderTable();

  const handleDeleteOrder = async (id: number) => {
    try {
      await OrderService.deleteOrder(id);
      removeOrder(id);
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const handleImportSuccess = () => {
    fetchOrders();
  };

  const actionCallbacks: OrderActionCallbacks = {
    onDelete: handleDeleteOrder,
  };

  const columns = getColumns();
  const actions = getActions(actionCallbacks);

  return (
    <div className="w-full">
      <div className="mb-6">
        <OrderActions
          selectedOrdersCount={0}
          selectedOrders={[]}
          onImportSuccess={handleImportSuccess}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
        </div>

        <SMSTable
          columns={columns}
          data={orders}
          actions={actions}
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          onPageChange={() => {}}
          onSearchChange={handleSearch}
          search={true}
          isLoading={isLoading}
          className="min-w-full"
          dateTimeFilter={false}
        />
      </div>
    </div>
  );
};

export default TableView;

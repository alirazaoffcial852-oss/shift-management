"use client";

import React from "react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import {
  getColumns,
  getActions,
  OrderActionCallbacks,
} from "./table-essentials";
import OrderService from "@/services/order.service";
import { toast } from "sonner";
import { useOrderTable } from "@/hooks/order/userOrderTable";
import { useTranslations } from "next-intl";

const ViewOrders = () => {
  const { orders, isLoading, pagination, handleSearch, removeOrder } =
    useOrderTable();
  const t = useTranslations();

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

  const actionCallbacks: OrderActionCallbacks = {
    onDelete: handleDeleteOrder,
  };

  const columns = getColumns(t);
  const actions = getActions(actionCallbacks, undefined, t);

  return (
    <div className="bg-white rounded-lg shadow-sm">
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
  );
};

export default ViewOrders;

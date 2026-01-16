import React from "react";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { OrderEvent } from "./OrderEvent";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@workspace/ui/components/context-menu";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface OrderDayCellProps {
  date: Date;
  orders: Order[];
  allOrders: Order[];
  onOrdersChange: (orders: Order[]) => void;
  selectedOrders: Order[];
  onOrderClick?: (order: Order) => void;
  onOrderSelect: (order: Order) => void;
  onDragStart?: (order: Order) => void;
  onDragEnd?: () => void;
  onDrop?: (date: Date) => void;
  draggedOrder?: Order | null;
  onDeleteOrder?: (orderId: number) => void;
}

export const OrderDayCell = ({
  date,
  orders,
  allOrders,
  onOrdersChange,
  selectedOrders,
  onOrderClick,
  onOrderSelect,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedOrder,
  onDeleteOrder,
}: OrderDayCellProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isToday =
    format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  const sortedOrders = [...orders].sort((a, b) => {
    return a.tonnage - b.tonnage;
  });

  const hasSelectedOrders = selectedOrders.length > 0;

  // Get current view from pathname
  const getCurrentView = () => {
    if (pathname.includes("/monthly")) return "monthly";
    if (pathname.includes("/weekly")) return "weekly";
    if (pathname.includes("/table")) return "table";
    return "monthly"; // default
  };

  const handleCreateOrder = () => {
    const dateString = format(date, "yyyy-MM-dd");
    const currentView = getCurrentView();
    router.push(
      `/shift-management/orders-shifts/add?date=${dateString}&returnTo=${currentView}`
    );
  };

  const handleEditSelectedOrders = () => {
    if (selectedOrders.length === 1 && selectedOrders[0]?.id !== undefined) {
      const currentView = getCurrentView();
      router.push(
        `/shift-management/orders-shifts/${selectedOrders[0].id}/edit?returnTo=${currentView}`
      );
    } else {
      console.log("Bulk edit for multiple orders:", selectedOrders);
    }
  };

  const handleDeleteSelectedOrders = () => {
    if (onDeleteOrder && selectedOrders.length > 0) {
      selectedOrders.forEach((order) => {
        if (order.id) {
          onDeleteOrder(order.id);
        }
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (onDrop) {
      onDrop(date);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "border border-dashed border-gray-300 min-h-[120px] relative p-2 h-full",
            isToday && "bg-[#BFD6C8]/30",
            "transition-colors duration-200 hover:bg-gray-50",
            draggedOrder && "bg-blue-50 border-blue-300"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div
            className={cn(
              `absolute top-2 left-2 text-sm text-[#A1A1A1] font-medium`,
              isToday && "text-primary font-bold"
            )}
          >
            {format(date, "dd")}
          </div>
          <div className="pt-6 px-1 space-y-1 overflow-y-auto h-full flex flex-col gap-3">
            {sortedOrders.map((order) => (
              <OrderEvent
                key={order.id}
                order={order}
                onOrdersChange={onOrdersChange}
                onOrderSelect={onOrderSelect}
                allOrders={allOrders}
                onClick={onOrderClick}
                isSelected={
                  order.id
                    ? selectedOrders?.some((o: Order) => o.id === order.id)
                    : false
                }
                onSelect={(order) => onOrderSelect(order)}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                isDragging={draggedOrder?.id === order.id}
                currentView={getCurrentView()}
              />
            ))}
          </div>
        </div>
      </ContextMenuTrigger>

      {hasSelectedOrders ? (
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            onClick={handleEditSelectedOrders}
            className="cursor-pointer"
          >
            Edit Orders
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleDeleteSelectedOrders}
            className="cursor-pointer text-red-600 hover:text-red-700"
          >
            Delete Orders
          </ContextMenuItem>
        </ContextMenuContent>
      ) : (
        <ContextMenuContent className="w-64">
          <ContextMenuItem
            onClick={handleCreateOrder}
            className="cursor-pointer"
          >
            Create Order
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

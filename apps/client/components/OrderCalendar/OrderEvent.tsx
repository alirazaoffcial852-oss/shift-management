import React from "react";
import { Order } from "@/types/order";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { Key, Store, MapPin, Scale, Truck, Calendar } from "lucide-react";

interface OrderEventProps {
  order: Order;
  onOrdersChange: (orders: Order[]) => void;
  onOrderSelect: (order: Order) => void;
  allOrders: Order[];
  onClick?: (order: Order) => void;
  isSelected: boolean;
  onSelect: (order: Order) => void;
  onDragStart?: (order: Order) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  currentView?: string;
}

export const OrderEvent = ({
  order,
  onOrdersChange,
  onOrderSelect,
  allOrders,
  onClick,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
  isDragging = false,
  currentView = "monthly",
}: OrderEventProps) => {
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isCheckboxClick =
      target instanceof HTMLInputElement && target.type === "checkbox";

    if (isCheckboxClick) {
      e.stopPropagation();
      onSelect(order);
      return;
    }

    e.stopPropagation();
    if (onClick) {
      onClick(order);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(order);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(order);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-50 border-blue-200";
      case "PENDING":
        return "bg-yellow-50 border-yellow-200";
      case "PLANNED_COMPLETED":
        return "bg-purple-50 border-purple-200";
      case "COMPLETED":
        return "bg-green-50 border-green-200";
      case "CANCELLED":
        return "bg-red-50 border-red-200";
      case "ARCHIVED":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={cn(
        "bg-white border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-gray-400",
        getStatusColor(order.status),
        isSelected && "ring-2 ring-blue-500 ring-offset-1",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex justify-end">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
          className="w-3 h-3 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-1 min-w-0">
          <Key className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-gray-700 flex items-center gap-1 min-w-0">
            <span>Order ID:</span>
            <span
              className="font-semibold text-gray-900 truncate"
              title={order.id?.toString()}
            >
              {order.id}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <Store className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-gray-700 flex items-center gap-1 min-w-0 whitespace-nowrap">
            <span>Supplier Plant:</span>
            <span
              className="font-semibold text-gray-900 truncate"
              title={
                order.supplier?.name ||
                order.supplier?.location ||
                order.supplier_id?.toString()
              }
            >
              {order.supplier?.name ||
                order.supplier?.location ||
                order.supplier_id}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <MapPin className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-gray-700 flex items-center gap-1 min-w-0">
            <span>Delivery Tariff Point:</span>
            <span
              className="font-semibold text-gray-900 truncate"
              title={
                order.tariff?.name ||
                order.tariff?.location ||
                order.tariff_id?.toString()
              }
            >
              {order.tariff?.name || order.tariff?.location || order.tariff_id}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <Scale className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-gray-700 flex items-center gap-1 min-w-0">
            <span>Tonnage:</span>
            <span
              className="font-semibold text-gray-900 truncate"
              title={`${order.tonnage} Tons`}
            >
              {order.tonnage} Tons
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <Truck className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-gray-700 flex items-center gap-1 min-w-0">
            <span>Types of Wagons:</span>
            <span
              className="font-semibold text-gray-900 truncate"
              title={order.type_of_wagon}
            >
              {order.type_of_wagon}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <Scale className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-gray-700 flex items-center gap-1 min-w-0">
            <span>Remaining:</span>
            <span
              className="font-semibold text-gray-900 truncate"
              title={`${order.remaining_tonnage ?? order.tonnage} Tons`}
            >
              {order.remaining_tonnage ?? order.tonnage} Tons
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1 min-w-0">
          <Calendar className="w-3 h-3 text-green-600 mr-1 flex-shrink-0" />
          <span className="text-gray-700 flex items-center gap-1 min-w-0">
            <span>Return Schedule:</span>
            <span
              className="font-semibold text-gray-900 truncate"
              title={
                order.return_schedule
                  ? format(new Date(order.return_schedule), "dd/MM/yyyy")
                  : "N/A"
              }
            >
              {order.return_schedule
                ? format(new Date(order.return_schedule), "dd/MM/yyyy")
                : "N/A"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

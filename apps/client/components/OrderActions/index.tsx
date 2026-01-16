"use client";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Order } from "@/types/order";
import { useState } from "react";
import ImportOrderDialog from "../Dialog/ImportOrderDialog";
import { useAuth } from "@/providers/appProvider";
import { usePermission } from "@/hooks/usePermission";

interface OrderActionsProps {
  selectedOrdersCount: number;
  selectedOrders: Order[];
  onImportSuccess?: () => void;
}

const OrderActions = ({
  selectedOrdersCount,
  selectedOrders,
  onImportSuccess,
}: OrderActionsProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isEmployee } = useAuth();
  const { hasPermission } = usePermission();

  return (
    <div>
      {!isEmployee && (
        <div className="flex justify-end gap-4 items-center">
          {hasPermission("order.create") && (
            <SMSButton
              text="Create Order"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={() => router.push("/shift-management/orders-shifts/add")}
            />
          )}
          {hasPermission("usn-shift.create") && (
            <SMSButton
              startIcon={<Plus className="h-4 w-4" />}
              text="Create shift"
              onClick={() =>
                router.push("/shift-management/project-usn-shifts/add")
              }
              variant="secondary"
            />
          )}
          {hasPermission("order.create") && (
            <SMSButton
              text="Import Order"
              onClick={() => setIsOpen(true)}
              variant="secondary"
            />
          )}
        </div>
      )}
      <ImportOrderDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onImportSuccess={onImportSuccess}
      />
    </div>
  );
};

export default OrderActions;

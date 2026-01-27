"use client";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Order } from "@/types/order";
import { useState } from "react";
import ImportOrderDialog from "../Dialog/ImportOrderDialog";
import ImportOrderInfoDialog from "../Dialog/ImportOrderInfoDialog";
import { useAuth } from "@/providers/appProvider";
import { usePermission } from "@/hooks/usePermission";
import { useTranslations } from "next-intl";

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
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { isEmployee } = useAuth();
  const { hasPermission } = usePermission();
  const t = useTranslations("common");

  return (
    <div>
      {!isEmployee && (
        <div className="flex justify-end gap-4 items-center">
          {hasPermission("order.create") && (
            <SMSButton
              text={t("create_order")}
              startIcon={<Plus className="h-4 w-4" />}
              onClick={() => router.push("/shift-management/orders-shifts/add")}
            />
          )}
          {hasPermission("usn-shift.create") && (
            <SMSButton
              startIcon={<Plus className="h-4 w-4" />}
              text={t("create_shift")}
              onClick={() =>
                router.push("/shift-management/project-usn-shifts/add")
              }
              variant="secondary"
            />
          )}
          {hasPermission("order.create") && (
            <>
              <SMSButton
                text={t("import_order_help_button")}
                onClick={() => setIsInfoOpen(true)}
                variant="secondary"
              />
              <SMSButton
                text="Import Order"
                onClick={() => setIsImportOpen(true)}
                variant="secondary"
              />
            </>
          )}
        </div>
      )}
      <ImportOrderDialog
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={onImportSuccess}
      />
      <ImportOrderInfoDialog
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
};

export default OrderActions;


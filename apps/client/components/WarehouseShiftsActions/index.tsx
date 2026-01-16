"use client";
import { useRouter } from "next/navigation";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { usePermission } from "@/hooks/usePermission";
import { Plus } from "lucide-react";

interface WarehouseShiftsActionsProps {
  selectedShiftsCount?: number;
}

const WarehouseShiftsActions = ({
  selectedShiftsCount = 0,
}: WarehouseShiftsActionsProps) => {
  const router = useRouter();
  const { hasPermission } = usePermission();

  return (
    <div>
      {hasPermission("usn-shift.create") && (
        <div className="flex justify-end gap-4 items-center">
          <SMSButton
            startIcon={<Plus className="h-4 w-4" />}
            className="text-[16px] h-[56px] px-6 font-semibold"
            text={"Create USN Shift"}
            onClick={() =>
              router.push("/shift-management/project-usn-shifts/add")
            }
          />
        </div>
      )}
    </div>
  );
};

export default WarehouseShiftsActions;

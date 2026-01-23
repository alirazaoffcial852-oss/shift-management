"use client";
import { useRouter } from "next/navigation";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { useAuth } from "@/providers/appProvider";
import { usePermission } from "@/hooks/usePermission";
import { Plus } from "lucide-react";

interface UsnShiftsActionsProps {
  selectedShiftsCount?: number;
}

const UsnShiftsActions = ({
  selectedShiftsCount = 0,
}: UsnShiftsActionsProps) => {
  const router = useRouter();
  const { isEmployee } = useAuth();
  const { hasPermission } = usePermission();

  return (
    <div>
      {!isEmployee && (
        <div className="flex justify-end gap-4 items-center">
          <SMSButton
            startIcon={
              <Image
                src={"/images/shift-active.svg"}
                alt={"Wagon Database"}
                width={18}
                height={18.73}
                className="text-white"
              />
            }
            className="text-[16px] h-[56px] px-6 font-semibold"
            text={"Wagon Database"}
            onClick={() =>
              router.push("/shift-management/project-usn-shifts/wagon-database")
            }
          />
          {hasPermission("usn-shift.create") && (
            <SMSButton
              startIcon={<Plus className="h-4 w-4" />}
              className="text-[16px] h-[56px] px-6 font-semibold"
              text={"Create USN Shift"}
              onClick={() =>
                router.push("/shift-management/project-usn-shifts/add")
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UsnShiftsActions;

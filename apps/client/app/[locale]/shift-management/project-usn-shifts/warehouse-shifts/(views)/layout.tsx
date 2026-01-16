"use client";
import { PropsWithChildren } from "react";
import WarehouseShiftsViewTabs from "@/components/WarehouseShiftsViewTabs";
import { usePathname } from "next/navigation";

const WarehouseShiftsViewsLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const hasId = lastSegment && !isNaN(Number(lastSegment));

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="min-h-[calc(100vh-200px)]">
        <div className="h-24 flex justify-end items-center mt-10 ">
          {!hasId && (
            <div className="mr-auto">
              <WarehouseShiftsViewTabs />
            </div>
          )}
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default WarehouseShiftsViewsLayout;

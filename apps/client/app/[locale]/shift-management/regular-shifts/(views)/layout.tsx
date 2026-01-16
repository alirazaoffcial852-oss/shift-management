"use client";
import { PropsWithChildren } from "react";
import CalendarViewTabs from "@/components/CalendarViewTabs";
import { usePathname } from "next/navigation";

const CalendarLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isEmployee = pathname.includes("/employee");
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  const hasId = lastSegment && !isNaN(Number(lastSegment));

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="min-h-[calc(100vh-200px)]">
        <div className="h-24 flex justify-end items-center mt-10 ">
          {!isEmployee && !hasId && (
            <div className="mr-auto">
              <CalendarViewTabs />
            </div>
          )}
        </div>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};

export default CalendarLayout;

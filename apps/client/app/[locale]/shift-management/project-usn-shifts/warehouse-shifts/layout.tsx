"use client";
import { ConfirmationProvider } from "@/providers/ConfirmationProvider";
import { PropsWithChildren } from "react";
import { useProjectUSNCalendar } from "@/hooks/projectUsnShifts/useProjectUSNCalendar";
import LoadingSpinner from "@/components/LoadingSpinner";

const WarehouseShiftsLayout = ({ children }: PropsWithChildren) => {
  const { isLoading } = useProjectUSNCalendar("monthly");

  if (isLoading) {
    return (
      <div className="container lg:w-[98%] mx-auto">
        <ConfirmationProvider>
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text="Loading warehouse shifts..." />
          </div>
        </ConfirmationProvider>
      </div>
    );
  }

  return (
    <>
      <div className="container lg:w-[98%] mx-auto">
        <ConfirmationProvider>{children}</ConfirmationProvider>
      </div>
    </>
  );
};

export default WarehouseShiftsLayout;

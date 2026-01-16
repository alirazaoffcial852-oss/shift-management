"use client";
import { ShiftProvider } from "@/providers/shiftProvider";
import { ConfirmationProvider } from "@/providers/ConfirmationProvider";
import { PropsWithChildren } from "react";
import ShiftNavigationTabs from "./components/ShiftNavigationTabs";

const ShiftManagementLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="container lg:w-[92%] mx-auto">
        <ConfirmationProvider>
          <ShiftProvider>
            <ShiftNavigationTabs />
            {children}
          </ShiftProvider>
        </ConfirmationProvider>
      </div>
    </>
  );
};

export default ShiftManagementLayout;

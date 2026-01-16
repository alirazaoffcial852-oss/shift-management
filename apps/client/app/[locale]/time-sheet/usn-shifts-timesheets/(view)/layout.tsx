import Navbar from "@/components/Navbar";
import TimeSheetViewTabs from "@/components/TimeSheetViewTabs";
import { PropsWithChildren } from "react";

const USNTimeSheetViewLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="space-y-4 px-0 lg:px-[30px] mt-14">
        <TimeSheetViewTabs />
        {children}
      </div>
    </>
  );
};

export default USNTimeSheetViewLayout;


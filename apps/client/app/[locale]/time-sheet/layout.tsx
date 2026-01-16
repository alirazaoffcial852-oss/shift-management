import Header from "@/components/Header";
import { PropsWithChildren } from "react";

const TimeSheetLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="container lg:w-[92%] mx-auto">{children}</div>
    </>
  );
};

export default TimeSheetLayout;

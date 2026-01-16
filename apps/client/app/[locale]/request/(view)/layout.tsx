import RequestTabs from "@/components/RequestTabs";
import { PropsWithChildren } from "react";

const RequestViewLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="space-y-4 px-0 lg:px-[30px] mt-14">
        <RequestTabs />
        {children}
      </div>
    </>
  );
};

export default RequestViewLayout;

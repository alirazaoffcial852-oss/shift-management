import { PropsWithChildren } from "react";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container lg:w-[92%] mx-auto">
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;

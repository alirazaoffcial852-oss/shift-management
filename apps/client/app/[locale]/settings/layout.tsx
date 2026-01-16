import Header from "@/components/Header";
import SettingTabs from "@/components/Layout/setting";
import Navbar from "@/components/Navbar";
import { PropsWithChildren } from "react";

const SettingLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="container lg:w-[92%] mx-auto">
        <SettingTabs>
          {" "}
          <div>{children}</div>
        </SettingTabs>
      </div>
    </>
  );
};

export default SettingLayout;

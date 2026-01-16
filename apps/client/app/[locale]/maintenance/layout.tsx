import React from "react";
import ResponsiveSidebar from "./components/globals/ResponsiveSidebar";

interface MaintenanceLayoutProps {
  children: React.ReactNode;
}

const MaintenanceLayout: React.FC<MaintenanceLayoutProps> = ({ children }) => {
  return (
    <div className="flex md:gap-32">
      <ResponsiveSidebar />
      <div className="lg:ml-4 p-4 lg:p-0 flex-1 overflow-x-auto">
        {children}
      </div>
    </div>
  );
};

export default MaintenanceLayout;

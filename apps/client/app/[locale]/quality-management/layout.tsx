import * as React from "react";
import ResponsiveSidebar from "./components/globals/ResponsiveSidebar";

interface QualityManagementLayoutProps {
	children: React.ReactNode;
}

const QualityManagementLayout = ({ children }: QualityManagementLayoutProps) => {
	return (
		<div className="flex md:gap-32">
			<ResponsiveSidebar />
			<div className="lg:ml-4 p-4 lg:p-0 flex-1 overflow-x-auto">
				{children}
			</div>
		</div>
	);
};

export default QualityManagementLayout;



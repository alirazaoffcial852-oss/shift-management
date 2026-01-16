"use client";

import { useAuth } from "@/providers/appProvider";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Navbar from "./Navbar";

export default function HeaderContainer() {
  const { isEmployee } = useAuth();
  const pathname = usePathname();

  const hiddenNavbarRoutes = [
    "/shift-management",
    "/time-sheet",
    "/configuration",
    "/sampling/add",
    "/wagon-list",
  ];
  const hiddenHeaderRoutes = ["/configuration"];

  const shouldHideNavbar = hiddenNavbarRoutes.some((route) =>
    pathname.includes(route)
  );
  const shouldHideHeader = hiddenHeaderRoutes.some((route) =>
    pathname.includes(route)
  );

  return (
    <>
      {!shouldHideHeader && (
        <div className="px-1 sm:px-2 md:px-4 max-w-full overflow-hidden">
          <Header />
          {!isEmployee && !shouldHideNavbar && <Navbar />}
        </div>
      )}
    </>
  );
}

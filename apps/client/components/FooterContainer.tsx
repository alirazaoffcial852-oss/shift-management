"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterContainer() {
  const pathname = usePathname();

  const hiddenFooterRoutes = ["/configuration"];

  const shouldHideHeader = hiddenFooterRoutes.some((route) => pathname.includes(route));

  return <>{!shouldHideHeader && <Footer />}</>;
}

"use client";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { NAV_ITEMS } from "@/routes";
import Image from "next/image";
import { useAuth, useCompany } from "@/providers/appProvider";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePermission } from "@/hooks/usePermission";

const Navbar = () => {
  const currentPath = usePathname();
  const { company } = useCompany();
  const { isEmployee } = useAuth();
  const { hasAnyPermission } = usePermission();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const t = useTranslations("navigation");

  const hasLocomotive = company?.configuration?.has_locomotive;
  const hasTrainDriver =
    company?.roles?.some((role: any) => role.has_train_driver === true) ?? true;

  const NavList = useMemo(() => {
    let filtered = isEmployee
      ? NAV_ITEMS.filter(
          (item) => item.label === "Dashboard" || item.label === "Setting"
        )
      : NAV_ITEMS;

    if (!hasTrainDriver) {
      filtered = filtered.filter(
        (item) =>
          item.label !== "Wagon" &&
          item.label !== "WagonList" &&
          item.label !== "Wagon-His" &&
          item.label !== "Track Cost"
      );
    }

    filtered = filtered.filter((item) => {
      if (item.label === "Dashboard" || item.label === "Setting") {
        return true;
      }

      const requiredPermissions = item.permissions || [];

      if (requiredPermissions.length === 0) {
        return true;
      }

      return hasAnyPermission(requiredPermissions);
    });

    return filtered;
  }, [isEmployee, hasAnyPermission, hasTrainDriver]);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isLarge = window.innerWidth >= 1400;
      setIsLargeScreen(isLarge);

      const hasScrollContent = container.scrollWidth > container.clientWidth;
      const hasScrollLeft = container.scrollLeft > 0;
      const hasScrollRight =
        hasScrollContent &&
        container.scrollLeft < container.scrollWidth - container.clientWidth;

      setShowLeftScroll(hasScrollLeft && hasScrollContent);
      setShowRightScroll(hasScrollRight && hasScrollContent);
    }
  }, []);

  useEffect(() => {
    const checkScrollAfterRender = () => {
      checkScroll();
    };

    checkScroll();

    const timer1 = setTimeout(checkScrollAfterRender, 100);
    const timer2 = setTimeout(checkScrollAfterRender, 500);
    const timer3 = setTimeout(checkScrollAfterRender, 1000);

    window.addEventListener("resize", checkScroll);

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", checkScroll);
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, [NavList, hasLocomotive, checkScroll]);

  if (currentPath.startsWith("/configure")) {
    return null;
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex justify-center w-full mt-6 mb-10">
      <div className="relative w-full md:max-w-[1250px] lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1700px]">
        <div className="relative">
          {!isEmployee && (
            <div className="relative px-10 md:px-12 lg:px-14">
              {showLeftScroll && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 z-20 p-2 bg-white shadow-md rounded-full -translate-y-1/2 top-1/2 hover:bg-gray-50 transition-all duration-300"
                  aria-label={t("scrollLeft")}
                >
                  <ChevronLeft className="text-gray-600 h-5 w-5" />
                </button>
              )}

              <div className="overflow-hidden py-3">
                <div
                  ref={scrollContainerRef}
                  className="flex space-x-2 md:space-x-4 overflow-x-auto scrollbar-hide w-full scroll-smooth justify-center"
                  onScroll={checkScroll}
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {NavList.map((item) => {
                    if (item.label === "Locomotives" && !hasLocomotive) {
                      return null;
                    }
                    const isActive =
                      currentPath.includes(item.href) ||
                      item.alternate.some((alt) => currentPath.endsWith(alt));

                    return (
                      <Link
                        key={item.label}
                        className={`
                          flex-none shadow-lg
                          transition-all duration-300
                          pt-4 pb-5 px-1 md:px-2
                          font-semibold rounded-lg
                          w-[110px] md:w-[118px] h-[95px] md:h-[100.84px]
                          group bg-white hover:bg-gray-50
                          cursor-pointer relative
                          flex flex-col justify-between items-center
                          ${
                            isActive
                              ? "before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-16 md:before:w-20 before:h-1 before:bg-[#3E8258] shadow-md"
                              : "before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-16 md:before:w-20 before:h-1 before:bg-[#3E8258] before:opacity-0 hover:before:opacity-100 hover:shadow-md"
                          }
                        `}
                        href={item.href}
                      >
                        <div className="flex justify-center items-center h-[28px]">
                          <div className="relative w-[24px] md:w-[27.35px] h-[24px] md:h-[28.47px]">
                            <Image
                              src={item.icon || "/placeholder.svg"}
                              alt={t(item.translationKey || "")}
                              fill
                              className="object-contain"
                              sizes="28px"
                            />
                          </div>
                        </div>
                        <div className="text-[11px] md:text-[12px] font-semibold uppercase px-1 text-center">
                          <div className="flex justify-center items-baseline">
                            <span className="text-[#2D2E33] md:hidden">
                              {t(`${item.translationKey}Short` || "")}
                            </span>
                            <span className="text-[#2D2E33] hidden md:block">
                              {t(item.translationKey || "")}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {showRightScroll && (
                <button
                  onClick={scrollRight}
                  className="absolute right-0 z-20 p-2 bg-white shadow-md rounded-full -translate-y-1/2 top-1/2 hover:bg-gray-50 transition-all duration-300"
                  aria-label={t("scrollRight")}
                >
                  <ChevronRight className="text-gray-600 h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

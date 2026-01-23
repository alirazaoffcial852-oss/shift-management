"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useCompany } from "@/providers/appProvider";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

const ShiftNavigationTabs = () => {
  const pathname = usePathname();
  const { isEmployee } = useAuth();
  const { hasPermission } = usePermission();
  const t = useTranslations("pages.shift.navigation");
  const { company } = useCompany();

  const shiftNavigationItems = [
    {
      translationKey: "regularShifts",
      href: "/shift-management/regular-shifts/monthly",
      alternate: [
        "/shift-management/regular-shifts/monthly",
        "/shift-management/regular-shifts/weekly",
      ],
      icon: "/images/bottom/shift/regular-shifts.svg",
      requiredPermission: "shift.read",
    },
    {
      translationKey: "ordersShifts",
      href: "/shift-management/orders-shifts",
      alternate: ["/shift-management/orders-shifts"],
      icon: "/images/bottom/shift/order.svg",
      requiredPermission: "shift.read",
    },
    {
      translationKey: "projectUsnShifts",
      href: "/shift-management/project-usn-shifts",
      alternate: ["/shift-management/project-usn-shifts"],
      icon: "/images/bottom/shift/project-usn-shifts.svg",
      requiredPermission: "usn-shift.read",
    },
    {
      translationKey: "warehouseShifts",
      href: "/shift-management/project-usn-shifts/warehouse-shifts",
      alternate: ["/shift-management/project-usn-shifts/warehouse-shifts"],
      icon: "/images/bottom/shift/warehouse-shifts.svg",
      requiredPermission: "usn-shift.read",
    },
  ];
7

  const hasTrainDriver =
    company?.roles?.some((role: any) => role.has_train_driver === true) ?? true; 

  let filteredItems = shiftNavigationItems;

  if (isEmployee) {
    filteredItems = filteredItems.filter(
      (item) => item.translationKey !== "ordersShifts"
    );
  }

  if (!hasTrainDriver) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.translationKey !== "ordersShifts" &&
        item.translationKey !== "projectUsnShifts" &&
        item.translationKey !== "warehouseShifts"
    );
  }

  filteredItems = filteredItems.filter((item) => {
    if (!item.requiredPermission) {
      return true;
    }
    return hasPermission(item.requiredPermission);
  });

  const isRouteActive = (key: string) => {
    switch (key) {
      case "warehouseShifts":
        return pathname.includes("/warehouse-shifts");
      case "projectUsnShifts":
        return (
          pathname.includes("/project-usn-shifts") &&
          !pathname.includes("/warehouse-shifts")
        );
      case "ordersShifts":
        return pathname.includes("/orders-shifts");
      case "regularShifts":
      default:
        return (
          pathname.includes("/regular-shifts") ||
          pathname === "/shift-management"
        );
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex space-x-2 md:space-x-4 -mb-12">
        {filteredItems.map((item) => {
          const isActive = isRouteActive(item.translationKey);
          const label = t(`${item.translationKey}.full`);
          const labelSmall = t(`${item.translationKey}.short`);

          return (
            <Link
              key={item.translationKey}
              className={`
                flex-none snap-center shadow-lg whitespace-nowrap
                transition-all duration-300 transform
                pt-4 pb-5 px-1 md:px-2 mb-[70px] md:mb-[74px] mt-[40px] md:mt-[43px]
                font-semibold rounded-lg
                w-[110px] md:w-[160px] h-[95px] md:h-[100px]
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
                    alt={label}
                    fill
                    className="object-contain"
                    sizes="28px"
                  />
                </div>
              </div>
              <div className="text-[11px] md:text-[13px] font-semibold px-1">
                <div className="flex justify-center items-baseline">
                  <span className="text-[#2D2E33] md:hidden">{labelSmall}</span>
                  <span className="text-[#2D2E33] hidden md:block">
                    {label}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ShiftNavigationTabs;

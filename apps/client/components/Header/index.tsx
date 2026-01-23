"use client";
import { usePathname, useRouter } from "next/navigation";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { cn } from "@workspace/ui/lib/utils";
import { Logo } from "./components/Logo";
import { CompanySelector } from "./components/CompanySelector";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { UserProfileMenu } from "./components/UserMenu";
import { MobileMenu } from "./components/MobileMenu";
import { useEffect, useRef, useState, useMemo } from "react";
import { navItems } from "@/constants/navItems.constant";
import { useTranslations } from "next-intl";
import { useAuth, useCompany } from "@/providers/appProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { getImagePath } from "@/utils/imagePath";

interface NavButtonProps {
  href: string;
  name: string;
  translationKey: string;
  icon: string;
  showIcon: boolean;
  isActive: boolean;
  onClick: () => void;
}

const NavButton = ({
  href,
  name,
  translationKey,
  icon,
  showIcon,
  isActive,
  onClick,
}: NavButtonProps) => {
  const t = useTranslations("navigation");

  return (
    <SMSButton
      variant={isActive ? "default" : "ghost"}
      text={t(translationKey)}
      className={cn(
        "h-[50px] font-semibold flex-shrink-0",
        "text-xs sm:text-[13px] md:text-[14px] shadow-sm",
        "px-1 sm:px-1.5 md:px-3",
        !isActive && "border border-[#0000001A] bg-white"
      )}
      onClick={onClick}
      {...(showIcon && {
        startIcon: (
          <div
            className={cn(
              "w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-current",
              isActive ? "bg-white" : "bg-black"
            )}
            style={{
              WebkitMaskImage: `url(${getImagePath(icon)})`,
              maskImage: `url(${getImagePath(icon)})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />
        ),
      })}
    />
  );
};

const MobileNavButton = ({
  href,
  name,
  translationKey,
  icon,
  isActive,
  onClick,
}: Omit<NavButtonProps, "showIcon">) => {
  const t = useTranslations("navigation");

  const displayKey = translationKey || name.toLowerCase().replace(/\s+/g, "");

  const safeTranslate = (key: string): string | null => {
    try {
      const result = t(key);
      return result;
    } catch (error) {
      console.warn(`Translation key "${key}" not found, using fallback`);
      return null;
    }
  };

  const displayText =
    safeTranslate(`${displayKey}Short`) || safeTranslate(displayKey) || name;

  const ariaLabel = safeTranslate(displayKey) || name;

  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center gap-1 w-16 flex-shrink-0 py-1.5",
        isActive ? "text-white" : "text-white/80",
        "transition-colors duration-200 hover:text-white"
      )}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <div
        className={cn(
          "w-[18px] h-[18px] bg-current",
          isActive ? "bg-white" : "bg-white/80"
        )}
        style={{
          WebkitMaskImage: `url(${icon})`,
          maskImage: `url(${icon})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
      <span className="text-[9px] font-medium text-center leading-tight max-w-full truncate">
        {displayText}
      </span>
    </button>
  );
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isEmployee } = useAuth();
  const { hasAnyPermission } = usePermission();
  const { company } = useCompany();
  const navRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [shouldShowIcon, setShouldShowIcon] = useState(false);

  useEffect(() => {
    const handleResize = () => setShouldShowIcon(window.innerWidth >= 1450);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (navRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    checkScroll();

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      setTimeout(checkScroll, 100);
    }

    return () => {
      if (navElement) {
        navElement.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [navRef.current]);

  const scrollNav = (direction: "left" | "right") => {
    if (navRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        direction === "left"
          ? navRef.current.scrollLeft - scrollAmount
          : navRef.current.scrollLeft + scrollAmount;

      navRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (pathname.startsWith("/configuration")) {
    return (
      <header className="bg-transparent">
        <div className="px-2 sm:px-4 h-14 flex items-center">
          <Logo className="h-8 sm:h-10" />
        </div>
      </header>
    );
  }

  const isNavItemActive = (href: string, children?: string[]) =>
    pathname.includes(href) ||
    (pathname.endsWith(href) && href !== "/") ||
    ((children &&
      children.some((child) => pathname.endsWith(child))) as boolean);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const permissionMap: Record<string, string[]> = {
    Home: [],
    "Shift Management": ["shift.read", "usn-shift.read"],
    Controlling: ["configuration.read"],
    "Time Sheet": ["timesheet.read"],
    "Handover Book": ["handover-book.read"],
    Maintenance: ["locomotive-action.read"],
    "Quality Management": ["quality-management.read"],
    Sample: ["sample.read"],
    Request: ["company-request-employee.read"],
  };

  const hasTrainDriver = useMemo(() => {
    if (!company?.roles) return true; 
    return company.roles.some((role: any) => role.has_train_driver === true);
  }, [company]);

  const roleBaseNavItems = useMemo(() => {
    let filtered = isEmployee
      ? navItems.filter(
          (item) =>
            item.name !== "Home" &&
            item.name !== "Controlling" &&
            item.name !== "Maintenance" &&
            item.name !== "Quality Management" &&
            item.name !== "Sample" &&
            item.name !== "Request"
        )
      : navItems;

    filtered = filtered.map((item) => {
      if (item.name === "Shift Management" && item.children && !hasTrainDriver) {
        return {
          ...item,
          children: item.children.filter((child) => {
            const locomotiveRoutes = [
              "orders-shifts",
              "project-usn-shifts",
              "warehouse-shifts",
              "wagon-database",
              "trains",
            ];
            return !locomotiveRoutes.some((route) => child.includes(route));
          }),
        };
      }
      return item;
    });

    filtered = filtered.filter((item) => {
      const requiredPermissions = permissionMap[item.name] || [];

      if (requiredPermissions.length === 0) {
        return true;
      }

      return hasAnyPermission(requiredPermissions);
    });

    return filtered;
  }, [isEmployee, hasAnyPermission, hasTrainDriver]);

  return (
    <header className="bg-transparent mt-2 sm:mt-3 md:mt-4">
      <div className="h-12 sm:h-13 md:h-14 hidden md:flex items-center justify-between gap-1 sm:gap-2 md:gap-3 relative">
        <Logo
          className="h-8 sm:h-9 md:h-10 max-w-xs"
          shouldShowIcon={shouldShowIcon}
        />

        <div className="relative flex-1 flex justify-center max-w-[calc(100%-430px)]">
          {canScrollLeft && (
            <button
              onClick={() => scrollNav("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full shadow-md w-7 h-7 flex items-center justify-center z-10 border border-gray-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <div
            ref={navRef}
            className="flex overflow-x-auto gap-0.5 sm:gap-1 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {roleBaseNavItems.map((item) => (
              <NavButton
                key={item.name}
                {...item}
                translationKey={
                  item.translationKey ||
                  item.name.toLowerCase().replace(/\s+/g, "")
                }
                showIcon={shouldShowIcon}
                isActive={isNavItemActive(item.href, item?.children)}
                onClick={() => handleNavigation(item.href)}
              />
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scrollNav("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full shadow-md w-7 h-7 flex items-center justify-center z-10 border border-gray-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 flex-shrink-0">
          {!isEmployee && <CompanySelector />}
          <LanguageSwitcher />
          <UserProfileMenu />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#3E8258] border-t border-border h-16 flex items-center px-1 z-20">
        <nav className="flex items-center justify-around w-full max-w-screen-sm mx-auto">
          {roleBaseNavItems.slice(0, 4).map((item) => (
            <MobileNavButton
              key={item.name}
              {...item}
              translationKey={
                item.translationKey ||
                item.name.toLowerCase().replace(/\s+/g, "")
              }
              isActive={isNavItemActive(item.href, item?.children)}
              onClick={() => handleNavigation(item.href)}
            />
          ))}

          <MobileMenu
            items={roleBaseNavItems.length > 4 ? roleBaseNavItems.slice(4) : []}
            isNavItemActive={isNavItemActive}
            handleNavigation={handleNavigation}
          />
        </nav>
      </div>
    </header>
  );
};

export default Header;

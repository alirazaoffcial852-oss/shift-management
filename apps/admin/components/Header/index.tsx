"use client";
import { usePathname, useRouter } from "next/navigation";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { cn } from "@workspace/ui/lib/utils";
import { Logo } from "./components/Logo";
import { UserMenu } from "./components/UserMenu";
import { MobileMenu } from "./components/MobileMenu";
import Image from "next/image";
import { navItems } from "@/constants/navItems.constant";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute = (itemHref: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|de)/, "");

    if (itemHref === "/") {
      return pathWithoutLocale === "" || pathWithoutLocale === "/";
    }

    return pathWithoutLocale === itemHref || pathWithoutLocale.startsWith(itemHref);
  };

  const isLogoOnlyRoute = pathname.startsWith("/configuration") || pathname.startsWith("/en/configuration") || pathname.startsWith("/de/configuration");

  if (isLogoOnlyRoute) {
    return (
      <header className="bg-transparent">
        <div className="px-4 h-14 flex items-center">
          <Logo />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-transparent mt-4 mb-[50px]">
      <div className="px-4 h-14 hidden md:flex items-center justify-between gap-3">
        <Logo className="h-10" />

        <nav className="flex flex-1 justify-center gap-1">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <SMSButton
                key={item.name}
                variant={isActive ? "default" : "ghost"}
                startIcon={<Image src={isActive ? item.activeIcon : item.icon} alt={item.name} width={18} height={18.73} className="text-white" />}
                text={item.name}
                className={cn("h-[50px] text-[16px] font-medium px-4", isActive ? "" : "border border-[#0000001A] bg-white")}
                onClick={() => router.push(item.href)}
              />
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#3E8258] border-t border-border h-14 flex items-center px-4 z-10">
        <nav className="flex items-center justify-center w-full ">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            return (
              <SMSButton
                key={item.name}
                variant="ghost"
                startIcon={<Image src={item.icon} alt={item.name} width={16} height={16} className="text-white" />}
                className={cn("h-8 w-8 flex-shrink-0", isActive ? "text-white" : "text-black")}
                onClick={() => router.push(item.href)}
              />
            );
          })}
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;

import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CompanySelector } from "./CompanySelector";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/appProvider";
import { useProfile } from "@/providers/profileProvider";
import { useEffect, useState, useMemo } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import BoringAvatar from "boring-avatars";
import { usePermission } from "@/hooks/usePermission";

interface MobileMenuProps {
  items?: Array<{
    name: string;
    href: string;
    translationKey?: string;
    icon: string;
    children?: string[];
  }>;
  isNavItemActive?: (href: string, children?: string[]) => boolean;
  handleNavigation?: (href: string) => void;
}

export const MobileMenu = ({
  items = [],
  isNavItemActive,
  handleNavigation,
}: MobileMenuProps) => {
  const t = useTranslations("navigation");
  const tActions = useTranslations("actions");
  const tUser = useTranslations("userMenu");
  const router = useRouter();
  const { user, logout, isEmployee } = useAuth();
  const { profileImagePreview, fetchUserProfile } = useProfile();
  const { hasAnyPermission } = usePermission();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && profileImagePreview === null) {
      fetchUserProfile();
    }
  }, [isOpen, profileImagePreview, fetchUserProfile]);

  const handleNavigateAndClose = (href: string) => {
    handleNavigation?.(href);
    setIsOpen(false);
  };

  const handleProfileNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          className="flex flex-col items-center justify-center gap-1 w-16 flex-shrink-0 py-1.5 text-white/80 hover:text-white transition-colors duration-200"
          aria-label={tActions("more")}
        >
          <Menu className="w-[18px] h-[18px]" />
          <span className="text-[9px] font-medium text-center leading-tight max-w-full truncate">
            {tActions("more")}
          </span>
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto max-h-[80vh] pb-safe">
        <div className="py-4">
          <div className="flex flex-col items-center justify-center mb-6 pt-2">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt={user?.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BoringAvatar size={64} name={user?.name} variant="beam" />
              )}
            </div>
            <h2 className="text-lg font-semibold mb-4 capitalize">
              {user?.name}
            </h2>

            <div className="flex gap-3 w-full justify-center">
              <button
                onClick={() => handleProfileNavigation("/settings/profile")}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">{tUser("profile")}</span>
              </button>
              <button
                onClick={() =>
                  handleProfileNavigation("/settings/change-password")
                }
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">{tUser("changePassword")}</span>
              </button>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">{tUser("logout")}</span>
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <LanguageSwitcher />
              {!isEmployee && <CompanySelector />}
            </div>
          </div>

          {items.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-semibold mb-3 px-1">Navigation</h3>
              <div className="grid grid-cols-4 gap-3">
                {items.map((item) => {
                  const isActive = isNavItemActive?.(item.href, item?.children);
                  const itemKey =
                    item.translationKey ||
                    item.name.toLowerCase().replace(/\s+/g, "");

                  return (
                    <button
                      key={item.name}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100"}`}
                      onClick={() => handleNavigateAndClose(item.href)}
                    >
                      <div
                        className={`w-5 h-5 bg-current ${isActive ? "text-primary" : "text-gray-700"}`}
                        style={{
                          WebkitMaskImage: `url(${item.icon})`,
                          maskImage: `url(${item.icon})`,
                          WebkitMaskSize: "contain",
                          maskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          maskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskPosition: "center",
                        }}
                      />
                      <span className="text-xs font-medium text-center">
                        {t(itemKey)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

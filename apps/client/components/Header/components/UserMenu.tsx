// ...existing code...
"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import Avatar from "boring-avatars";
import { useAuth } from "@/providers/appProvider";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useProfile } from "@/providers/profileProvider";
import { useEffect, useMemo } from "react";

export const UserProfileMenu = () => {
  const { user, logout } = useAuth();
  const { profileImagePreview, fetchUserProfile } = useProfile();
  const router = useRouter();
  const t = useTranslations("userMenu");

  useEffect(() => {
    if (profileImagePreview === null) {
      fetchUserProfile();
    }
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return "";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }, [user?.name]);

  const backgroundColor = useMemo(() => {
    if (!user?.name) return "#6366f1";

    const hash = user.name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  }, [user?.name]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer flex-shrink-0">
          {profileImagePreview ? (
            <img src={profileImagePreview} alt={user?.name || "Profile"} className="w-full h-full object-cover" />
          ) : (
            <div style={{ backgroundColor }} className="w-full h-full flex items-center justify-center text-white font-medium">
              {initials}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 border-b">
          <div className="font-medium capitalize">{user && user.name}</div>
        </div>
        <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
          <User className="mr-2 h-4 w-4" />
          {t("profile")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings/change-password")}>
          <Settings className="mr-2 h-4 w-4" />
          {t("changePassword")}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600" onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

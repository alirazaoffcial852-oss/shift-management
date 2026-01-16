"use client";
import { useSettingTabs } from "@/hooks/settings";
import { useAuth } from "@/providers/appProvider";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, ReactNode, use } from "react";

interface SettingTabsProps {
  children: ReactNode;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

const SettingTabs: React.FC<SettingTabsProps> = ({ children }) => {
  const tSetting = useTranslations("pages.settings");
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const SettingTabList = useSettingTabs();

  return (
    <div className="container mx-auto mt-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{tSetting("title")}</h1>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="flex flex-wrap border-b px-4">
          {SettingTabList?.map((STATUS) => (
            <button
              key={STATUS.id}
              onClick={() => handleTabClick(STATUS.path)}
              className={`px-6 py-2 m-2 text-sm rounded-lg font-medium transition-colors duration-200 ${
                pathname.includes(STATUS.path) || STATUS.alt.includes(pathname) ? "bg-[#3E8258] text-white" : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {STATUS.label}
            </button>
          ))}
        </div>

        <div className="pt-8 bg-white">{children}</div>
      </div>
    </div>
  );
};

export default SettingTabs;

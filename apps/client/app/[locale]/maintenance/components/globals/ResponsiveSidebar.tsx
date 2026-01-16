"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import homeIconBlack from "@/public/images/home-smile.svg";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMaintenance } from "@/hooks/maintenance";

const ResponsiveSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleSidebar = (): void => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (): void => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const menuItems = useMaintenance();

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#3E8258] text-white rounded-md shadow-lg hover:bg-[#3E8258] transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <div className="flex gap-40 mt-5">
        <div
          className={`
          fixed lg:static top-0 left-0 h-full lg:h-auto
          w-64 lg:w-auto lg:max-w-[250px]
          bg-white lg:bg-transparent
          shadow-xl lg:shadow-none
          z-40 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
          pt-16 lg:pt-0 px-4 lg:px-0
          mb-0 lg:mb-14
        `}
        >
          <div className="lg:hidden mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900"></h2>
          </div>

          <div className="flex flex-col gap-2 lg:gap-2">
            {menuItems.map((item, index) => {
              const localeRegex = /^\/(en|fr|de|es)/;
              const cleanPathname = pathname.replace(localeRegex, "");
              const isActive: boolean = cleanPathname === item.path;
              return (
                <Link key={index} href={item.path} onClick={handleLinkClick}>
                  <Button
                    size={"lg"}
                    className={`flex justify-start items-center shadow-lg white transition-all duration-200 w-full ${
                      isActive
                        ? "bg-[#3E8258] text-white hover:bg-[#3E8258]"
                        : "bg-white text-black hover:bg-gray-50"
                    }`}
                  >
                    <Image
                      src={homeIconBlack}
                      width={20}
                      height={20}
                      alt="icon"
                      className={`${isActive ? "filter brightness-0 invert" : ""} -ml-3`}
                      priority={index === 0}
                    />
                    <span className="truncate">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="lg:hidden mt-auto pb-8" />
        </div>
      </div>
    </>
  );
};

export default ResponsiveSidebar;

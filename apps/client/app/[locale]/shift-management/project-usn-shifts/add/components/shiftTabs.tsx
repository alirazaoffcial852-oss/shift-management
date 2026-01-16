"use client";
import { useState } from "react";
import "./tabs.css";
import { usePathname, useRouter } from "next/navigation";
import { projectUSNOption } from "@/constants";
import { useTranslations } from "next-intl";

export default function ShiftTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("pages.shift");
  const [value, setValue] = useState("request/receive");

  const getLabel = (route: string) => {
    if (route.includes("regular-shifts")) {
      return t("regularShift");
    } else if (route.includes("project-usn-shifts")) {
      return t("projectUSN");
    }
    return "";
  };

  return (
    <div className="sms-radio-inputs !w-[350px]">
      {projectUSNOption.map((option) => (
        <label className="sms-radio" key={option.route} htmlFor={option.route}>
          <input
            checked={value === option.route || pathname.includes(option.route)}
            name="radio"
            type="radio"
            id={option.route}
            onChange={() => {
              setValue(option.route);
              router.push(option.route);
            }}
          />
          <span className="name">{getLabel(option.route)}</span>
        </label>
      ))}
    </div>
  );
}

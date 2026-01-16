"use client";
import { useState } from "react";
import "./tabs.css";
import { usePathname, useRouter } from "next/navigation";
import { ProductOptions } from "@/constants";
import { useTranslations } from "next-intl";

export default function RequestTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("pages.products");
  const [value, setValue] = useState("request/receive");

  const getLabel = (label: string) => {
    if (label === "Regular Product") return t("regularProduct");
    if (label === "Project USN Product") return t("projectUsnProduct");
    return label;
  };

  return (
    <div className="sms-radio-inputs !w-[350px]">
      {ProductOptions.map((option) => (
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
          <span className="name">{getLabel(option.label)}</span>
        </label>
      ))}
    </div>
  );
}

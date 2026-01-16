"use client";
import { useState } from "react";
import "./tabs.css";
import { usePathname, useRouter } from "next/navigation";
import { RequestOptions } from "@/constants";
import { useTranslations } from "next-intl";

export default function RequestTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("pages.request");
  const [value, setValue] = useState("request/receive");

  return (
    <div className="sms-radio-inputs !w-[350px]">
      {RequestOptions.map((option) => {
        const getLabel = (label: string) => {
          if (label === "Receive") return t("receive");
          if (label === "Send") return t("send");
          return label;
        };
        return (
          <label
            className="sms-radio"
            key={option.route}
            htmlFor={option.route}
          >
            <input
              checked={
                value === option.route || pathname.includes(option.route)
              }
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
        );
      })}
    </div>
  );
}

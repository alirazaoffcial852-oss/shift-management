"use client";
import { useState, useCallback } from "react";
import "./tabs.css";
import { usePathname, useRouter } from "next/navigation";
import { useOrderViewTabs } from "@/hooks/orderCalenderViewTab";

export default function OrderViewTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("orders/monthly");

  const handleTabChange = useCallback(
    (route: string) => {
      setValue(route);
      setTimeout(() => {
        router.push(route, { scroll: false });
      }, 0);
    },
    [router]
  );
  let options = useOrderViewTabs();
  return (
    <div className="sms-radio-inputs">
      {options.map((option) => (
        <label className="sms-radio" key={option.route}>
          <input
            checked={value === option.route || pathname.includes(option.route)}
            name="radio"
            type="radio"
            onChange={() => handleTabChange(option.route)}
          />
          <span className="name">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

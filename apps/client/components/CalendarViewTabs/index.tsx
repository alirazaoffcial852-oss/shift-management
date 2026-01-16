"use client";
import { useState, useCallback } from "react";
import "./tabs.css";
import { usePathname, useRouter } from "next/navigation";
import { useCalandarTabs } from "@/hooks/calendarViewTabs";

export default function CalendarViewTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("shift-management/monthly");

  const handleTabChange = useCallback(
    (route: string) => {
      setValue(route);
      setTimeout(() => {
        router.push(route, { scroll: false });
      }, 0);
    },
    [router]
  );
  let options = useCalandarTabs();
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

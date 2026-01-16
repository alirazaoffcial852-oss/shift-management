"use client";
import { useState, useCallback } from "react";
import "../OrderViewTabs/tabs.css";
import { usePathname, useRouter } from "next/navigation";
import { useUsnShiftsViewTabs } from "@/hooks/projectUsnShifts/useUsnShiftsViewTabs";
import { useAuth } from "@/providers/appProvider";

export default function USNShiftsViewTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const { isEmployee } = useAuth();
  const [value, setValue] = useState(
    "/shift-management/project-usn-shifts/usn-shifts/monthly"
  );

  const handleTabChange = useCallback(
    (route: string) => {
      setValue(route);
      setTimeout(() => {
        router.push(route, { scroll: false });
      }, 0);
    },
    [router]
  );

  let options = useUsnShiftsViewTabs();

  return (
    <div className="sms-radio-inputs">
      {options.map((option) => {
        const isWeeklyView = option.route.includes("weekly");
        const isDisabled = isEmployee && isWeeklyView;

        return (
          <label
            className={`sms-radio ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            key={option.route}
          >
            <input
              checked={
                value === option.route || pathname.includes(option.route)
              }
              name="radio"
              type="radio"
              disabled={isDisabled}
              onChange={() => {
                if (!isDisabled) {
                  handleTabChange(option.route);
                }
              }}
            />
            <span className="name">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

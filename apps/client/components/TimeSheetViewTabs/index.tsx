"use client";
import { useState, useEffect } from "react";
import "./tabs.css";
import { usePathname, useRouter } from "next/navigation";
import {
  regularShiftsTimeSheettOptions,
  projectUSNTimeSheettOptions,
} from "@/constants";
import { useTranslations } from "next-intl";

export default function TimeSheetViewTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("timesheet");
  const isUSN = pathname?.includes("usn-shifts-timesheets");
  const [timesheetType, setTimesheetType] = useState<"regular" | "usn">(
    isUSN ? "usn" : "regular"
  );
  const [value, setValue] = useState("time-sheet/approved");

  useEffect(() => {
    const isUSNPath = pathname?.includes("usn-shifts-timesheets");
    setTimesheetType(isUSNPath ? "usn" : "regular");
  }, [pathname]);

  const options =
    timesheetType === "usn"
      ? projectUSNTimeSheettOptions
      : regularShiftsTimeSheettOptions;

  const handleTypeToggle = (type: "regular" | "usn") => {
    setTimesheetType(type);
    const currentStatus = pathname?.split("/").pop() || "submitted";
    const baseRoute =
      type === "usn"
        ? "/time-sheet/usn-shifts-timesheets"
        : "/time-sheet/regular-shifts-timesheets";
    router.push(`${baseRoute}/${currentStatus}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeToggle("regular")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timesheetType === "regular"
                ? "bg-green-800 text-white opacity-80"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("regularShifts")}
          </button>
          <button
            onClick={() => handleTypeToggle("usn")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timesheetType === "usn"
                ? "bg-green-800 text-white opacity-80"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t("usnShifts")}
          </button>
        </div>
      </div>

      <div className="sms-radio-inputs !w-[500px]">
        {options.map((option: { route: string; label: string }) => {
          const getLabel = (label: string) => {
            if (label === "Submitted") return t("submitted");
            if (label === "Draft") return t("draft");
            if (label === "Approved") return t("approved");
            if (label === "Rejected") return t("rejected");
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
    </div>
  );
}

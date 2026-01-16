"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface Option {
  label: string;
  value: string | number | boolean;
}

interface FilterPillProps {
  label: string;
  options: Option[];
  value?: Option | null;
  onChange?: (option: Option | null) => void;
}

const pillBase =
  "h-9 px-3 rounded-full border border-[#E6E6E6] bg-white text-[13px] flex items-center gap-2";

export default function FilterPill({
  label,
  options,
  value,
  onChange,
}: FilterPillProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={pillBase} aria-label={`${label} filter`}>
          <span className="truncate max-w-[140px]">
            {value ? `${label}: ${value.label}` : label}
          </span>
          <span className="text-[#9CA3AF]">▾</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem
          onClick={() => onChange?.(null)}
          className="text-[#6B7280]"
        >
          Clear
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={String(opt.value)}
            onClick={() => onChange?.(opt)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

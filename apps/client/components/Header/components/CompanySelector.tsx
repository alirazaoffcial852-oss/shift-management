"use client";

import { useCompany } from "@/providers/appProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import type { Company } from "@/types/configuration";
import { useTranslations } from "next-intl";

type ExtendedCompany = Company & { id: number };

export const CompanySelector = () => {
  const { company, setCompany, companies } = useCompany();
  const t = useTranslations("navigation");

  if (companies.length === 0) {
    return (
      <div className="bg-white rounded-lg flex items-center w-[221px] h-[50px] pr-2 shadow-sm">
        <div className="pl-4 pr-2">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-[137.5px] h-[40px] rounded-lg bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg flex items-center p-2 shadow-sm">
      <span className="text-[12px] text-[#2D2E33] pl-4 pr-2 font-semibold capitalize">
        {t("company")}
      </span>
      <Select
        value={company?.id?.toString() || ""}
        onValueChange={(value) => {
          const company = companies.find((c) => c.id.toString() === value);
          setCompany(company as ExtendedCompany);
          localStorage.setItem(
            "selected-company",
            JSON.stringify(company as ExtendedCompany)
          );
        }}
      >
        <SelectTrigger className="w-[137.5px] capitalize rounded-lg h-[40px] bg-[#BFD6C8] border-0 text-[14px] font-medium focus:ring-0 focus:ring-offset-0 mt-0">
          <SelectValue
            placeholder="Select company"
            className="text-right pr-2"
          />
        </SelectTrigger>
        <SelectContent>
          {companies?.map((company) => (
            <SelectItem
              key={company.id}
              value={company?.id?.toString() || ""}
              className="text-[14px] capitalize"
            >
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

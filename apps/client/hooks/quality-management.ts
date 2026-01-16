"use client";
import { TabItem } from "@/types/maintenance";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

export const useQualityManagement = (): TabItem[] => {
  const t = useTranslations("pages.qualityManagement");

  const tabs: TabItem[] = [
    {
      icon: Home,
      label: t("overview"),
      path: "/quality-management/overview",
    },
    {
      icon: Home,
      label: t("topics"),
      path: "/quality-management/topics",
    },
    {
      icon: Home,
      label: t("employees_feedbacks"),
      path: "/quality-management/employees-feedbacks",
    },
    {
      icon: Home,
      label: t("customers_feedbacks"),
      path: "/quality-management/customers-feedbacks",
    },
    {
      icon: Home,
      label: t("company_feedbacks"),
      path: "/quality-management/company-feedbacks",
    },
  ];

  return tabs;
};

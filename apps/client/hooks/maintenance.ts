import { TabItem } from "@/types/maintenance";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";

export const useMaintenance = (): TabItem[] => {
  const t = useTranslations("pages.maintenance");

  const tabs: TabItem[] = [
    {
      icon: Home,
      label: t("overviewOfLocomotive"),
      path: "/maintenance/overview-of-locomotive",
    },
    {
      icon: Home,
      label: t("overviewOfActions"),
      path: "/maintenance/overview-of-actions",
    },
    {
      icon: Home,
      label: t("reasons"),
      path: "/maintenance/reasons",
    },
    {
      icon: Home,
      label: t("historyOfMaintenance"),
      path: "/maintenance/history-of-maintenance",
    },
  ];

  return tabs;
};

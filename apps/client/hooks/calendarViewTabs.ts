import { useTranslations } from "next-intl";

export const useCalandarTabs = () => {
  const t = useTranslations("pages.calandar.view");

  const tabs = [
    { label: t("monthly"), route: "/shift-management/regular-shifts/monthly" },
    { label: t("weekly"), route: "/shift-management/regular-shifts/weekly" },
  ];
  return tabs;
};

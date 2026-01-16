import { useTranslations } from "next-intl";

export const useOrderViewTabs = () => {
  const t = useTranslations("pages.order");

  const tabs = [
    { label: t("monthly"), route: "/shift-management/orders-shifts/monthly" },
    { label: t("weekly"), route: "/shift-management/orders-shifts/weekly" },
    { label: t("table"), route: "/shift-management/orders-shifts/table" },
  ];
  return tabs;
};

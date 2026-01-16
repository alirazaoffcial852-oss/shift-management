import { useTranslations } from "next-intl";

export const useWarehouseShiftsViewTabs = () => {
  const t = useTranslations("pages.calandar.view");

  const tabs = [
    {
      label: t("monthly"),
      route: "/shift-management/project-usn-shifts/warehouse-shifts/monthly",
    },
    {
      label: t("weekly"),
      route: "/shift-management/project-usn-shifts/warehouse-shifts/weekly",
    },
  ];
  return tabs;
};

import { useTranslations } from "next-intl";

export const useUsnShiftsViewTabs = () => {
  const t = useTranslations("pages.calandar.view");

  const tabs = [
    {
      label: t("monthly"),
      route: "/shift-management/project-usn-shifts/usn-shifts/monthly",
    },
    {
      label: t("weekly"),
      route: "/shift-management/project-usn-shifts/usn-shifts/weekly",
    },
  ];
  return tabs;
};

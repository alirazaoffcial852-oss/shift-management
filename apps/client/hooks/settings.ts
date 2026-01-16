import { useAuth } from "@/providers/appProvider";
import { TabItem } from "@/types/setting";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

export const useSettingTabs = (): TabItem[] => {
  const { isEmployee } = useAuth();
  const { hasPermission } = usePermission();
  const t = useTranslations("pages.settings");

  const tabs = [
    {
      id: "1",
      label: t("profile"),
      path: "/settings/profile",
      alt: [],
      requiredPermission: null,
    },
    {
      id: "5",
      label: t("changePassword"),
      path: "/settings/change-password",
      alt: [],
      requiredPermission: null,
    },
    {
      id: "2",
      label: t("company"),
      path: "/settings/company",
      alt: [],
      requiredPermission: "company.read",
    },
    {
      id: "3",
      label: t("holidays"),
      path: "/settings/holidays",
      alt: ["/settings/holidays/add"],
      requiredPermission: "settings.holiday",
    },
    {
      id: "4",
      label: t("role_permission"),
      path: "/settings/role",
      alt: [],
      requiredPermission: "settings.role",
    },
    {
      id: "6",
      label: t("cost_center"),
      path: "/settings/cost-center",
      alt: [],
      requiredPermission: "settings.cost-center",
    },
    {
      id: "7",
      label: t("type_of_operation"),
      path: "/settings/type-of-operation",
      alt: [],
      requiredPermission: "settings.operation-type",
    },
  ];

  if (isEmployee) {
    return tabs.filter(
      (tab) =>
        tab.path === "/settings/profile" ||
        tab.path === "/settings/change-password"
    );
  }

  return tabs.filter((tab) => {
    if (!tab.requiredPermission) {
      return true;
    }
    return hasPermission(tab.requiredPermission);
  });
};

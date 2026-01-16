import { useTranslations } from "next-intl";

export const useSteps = () => {
  const t = useTranslations("steps.products");

  return [
    { title: t("basic_information") },
    { title: t("pricing_model") },
    { title: t("toll_cost") },
    { title: t("choose_personnel") },
    { title: t("details_selected_personnel") },
  ];
};

export const useStepsForCustomization = () => {
  const t = useTranslations("steps.products");

  return [
    { title: t("Select Customization") },
    { title: t("basic_information") },
    { title: t("pricing_model") },
    { title: t("toll_cost") },
    { title: t("details_selected_personnel") },
  ];
};

export const useStepsForAddEdit = () => {
  const t = useTranslations("steps.products");

  return [
    { title: t("Select Customization") },
    { title: t("basic_information") },
    { title: t("pricing_model") },
    { title: t("toll_cost") },
    { title: t("choose_personnel") },
    { title: t("details_selected_personnel") },
  ];
};

export const useWegonList = () => {
  return [
    {
      title: "Train Preparation",
    },
    {
      title: "Wagon Numbers",
    },
  ];
};

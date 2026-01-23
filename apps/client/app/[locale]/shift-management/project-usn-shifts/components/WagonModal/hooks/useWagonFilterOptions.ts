import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { WAGON_TYPE_OPTIONS } from "../constants/wagonModal.constants";

export const useWagonFilterOptions = () => {
  const t = useTranslations("pages.projectUsn.wagonModal");

  const statusOptions = useMemo(
    () => [
      { value: "EMPTY", label: t("filters.statusOptions.EMPTY") },
      {
        value: "PLANNED_TO_BE_LOADED",
        label: t("filters.statusOptions.PLANNED_TO_BE_LOADED"),
      },
      {
        value: "SHOULD_BE_LOADED",
        label: t("filters.statusOptions.SHOULD_BE_LOADED"),
      },
      { value: "LOADED", label: t("filters.statusOptions.LOADED") },
      {
        value: "PLANNED_TO_BE_EMPTY",
        label: t("filters.statusOptions.PLANNED_TO_BE_EMPTY"),
      },
      {
        value: "SHOULD_BE_EMPTY",
        label: t("filters.statusOptions.SHOULD_BE_EMPTY"),
      },
      { value: "DAMAGED", label: t("filters.statusOptions.DAMAGED") },
    ],
    [t]
  );

  const statusLabelMap = useMemo(
    () =>
      statusOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
    [statusOptions]
  );

  const wagonTypeOptions = useMemo(
    () =>
      WAGON_TYPE_OPTIONS.map((option) => ({
        ...option,
        label: option.value === "Fas" ? t("filters.wagonTypes.fas") : option.label,
      })),
    [t]
  );

  const railOptions = useMemo(
    () => [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "on train", label: t("filters.railOptions.onTrain") },
    ],
    [t]
  );

  return {
    statusOptions,
    statusLabelMap,
    wagonTypeOptions,
    railOptions,
  };
};

import { useTranslations } from "next-intl";

export const useStatusIdentifiers = () => {
  const t = useTranslations("pages.calandar.status");

  const statusIdentifiers = [
    {
      id: "OPEN",
      colorCode: "border-dashed border-2 border-gray-400 bg-white",
      title: t("open"),
    },
    {
      id: "OFFER",
      colorCode: "border-dashed border-2 border-gray-400 bg-white",
      title: t("offer"),
    },
    {
      id: "PLANNED",
      colorCode: "bg-gray-200",
      title: t("planned"),
    },
    {
      id: "FIXED",
      colorCode: "bg-blue-50",
      title: t("fixed"),
    },
    {
      id: "SUBMITTED",
      colorCode: "bg-orange-100",
      title: t("submitted"),
    },
    {
      id: "APPROVED",
      colorCode: "bg-yellow-100",
      title: t("approved"),
    },
    {
      id: "BILLED",
      colorCode: "bg-green-100",
      title: t("billed"),
    },
    {
      id: "REJECTED",
      colorCode: "bg-red-100",
      title: t("rejected"),
    },
  ];

  return statusIdentifiers;
};

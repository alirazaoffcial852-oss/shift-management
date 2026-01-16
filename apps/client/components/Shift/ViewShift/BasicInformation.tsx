import { Shift } from "@/types/shift";
import { InfoField } from "./InfoField";
import { useTranslations } from "next-intl";

interface BasicInformationProps {
  shift: Shift;
}

export const BasicInformationView = ({ shift }: BasicInformationProps) => {
  const t = useTranslations("pages.shift");

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "-";

    const date = new Date(timeString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-[22px] font-semibold !mt-8 mb-4">
        {t("BasicInformation")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField
          label={t("Date")}
          value={new Date(shift.date || "").toLocaleDateString()}
        />
        <InfoField
          label={t("StartTime")}
          value={formatTime(shift.start_time)}
        />
        <InfoField label={t("EndTime")} value={formatTime(shift.end_time)} />
      </div>
    </div>
  );
};

import { Shift } from "@/types/shift";
import { InfoField } from "./InfoField";
import { useTranslations } from "next-intl";

interface ShiftInformationProps {
  shift: Shift;
}

export const ShiftInformationView = ({ shift }: ShiftInformationProps) => {
  const t = useTranslations("pages.shift");

  return (
    <div className="space-y-3">
      <h3 className="text-[22px] font-semibold !mt-8 mb-4">
        {t("ShiftInformation")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField
          label={t("Customer")}
          value={shift?.customer?.name || "N/A"}
        />
        <InfoField label={t("Project")} value={shift.project?.name || "N/A"} />
        <InfoField
          label={t("BvProject")}
          value={shift.bv_project?.name || "N/A"}
        />
        <InfoField
          label={t("Location")}
          value={shift?.location || shift.shiftDetail?.location || "N/A"}
        />
        <InfoField
          label={t("TypeOfOperation")}
          value={shift?.shiftDetail?.type_of_operation?.name || "N/A"}
        />
        <InfoField label={t("Product")} value={shift?.product?.name || "N/A"} />
        <InfoField
          label={t("Locomotive")}
          value={shift?.locomotive?.name || "N/A"}
        />
      </div>

      <h3 className="text-[22px] font-semibold !mt-8 mb-4">{t("Personnel")}</h3>

      {shift?.shiftRole?.map((role: any, index: number) => (
        <div key={index}>
          <h3 className="text-[22px] font-semibold !mt-8 capitalize">
            {role?.role?.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField
              label={t("Employee")}
              value={role?.employee?.name || "N/A"}
            />
            <InfoField
              label={t("Proximity")}
              value={role?.proximity?.toLowerCase() || "N/A"}
            />
            <InfoField
              label={t("BreakDuration")}
              value={role?.break_duration || "N/A"}
            />
            <InfoField label={t("StartDay")} value={role?.start_day || "N/A"} />
          </div>
        </div>
      ))}
    </div>
  );
};

import { Shift } from "@/types/shift";
import { InfoField } from "./InfoField";
import { useTranslations } from "next-intl";

interface ShiftDetailProps {
  shift: Shift;
}

export const ShiftDetailView = ({ shift }: ShiftDetailProps) => {
  const t = useTranslations("pages.shift");
  return (
    <div className="space-y-3">
      <h3 className="text-[22px] font-semibold !mt-8 mb-4">
        {t("CustomerContactPerson")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField
          label={t("Customer")}
          value={shift.customer?.name || "N/A"}
        />
        <InfoField label={t("Phone")} value={shift.customer?.phone || "N/A"} />

        {shift?.shiftDetail?.has_contact_person && (
          <>
            <InfoField
              label={t("ContactPerson")}
              value={shift.shiftDetail?.contact_person_name || "N/A"}
            />
            <InfoField
              label={t("ContactPerson")}
              value={shift.shiftDetail?.contact_person_name || "N/A"}
            />
            <InfoField
              label={t("ContactPersonPhone")}
              value={shift.shiftDetail?.contact_person_phone || "N/A"}
            />
            <InfoField
              label={t("Dispatcher")}
              value={shift.dispatcher?.name || "N/A"}
            />
          </>
        )}

        {shift?.shiftDetail?.has_note && (
          <InfoField
            label={t("ShiftNote")}
            value={shift.shiftDetail?.note || "N/A"}
          />
        )}
        <h3 className="text-[22px] font-semibold !mt-10 mb-4">{t("Train")}</h3>
      </div>

      {shift?.shiftTrain?.map((train, index) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={index}>
          <InfoField label={t("TrainNo")} value={train.train_no || "N/A"} />
          <InfoField
            label={t("DepartureLocation")}
            value={train.departure_location || "N/A"}
          />
          <InfoField
            label={t("ArrivalLocation")}
            value={train.arrival_location || "N/A"}
          />
        </div>
      ))}
    </div>
  );
};

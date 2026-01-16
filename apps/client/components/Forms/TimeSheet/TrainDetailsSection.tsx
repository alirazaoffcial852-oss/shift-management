"use client";
import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { PlusCircle, Trash2 } from "lucide-react";
import { TrainDetail } from "@/types/timeSheet";
import MapWithSearch from "@/components/Map";
import { Shift } from "@/types/shift";
import { useTranslations } from "next-intl";

interface TrainDetailsSectionProps {
  trainDetails: TrainDetail[];
  onUpdate: (trainDetails: TrainDetail[]) => void;
  errors?: { [key: number]: { [key: string]: string } };
  shift?: Shift;
}

export const TrainDetailsSection: React.FC<TrainDetailsSectionProps> = ({
  trainDetails,
  onUpdate,
  errors = {},
  shift,
}) => {
  const t = useTranslations("timesheet");
  const handleInputChange = (
    index: number,
    field: keyof TrainDetail,
    value: string
  ) => {
    const updated = [...trainDetails];
    updated[index] = { ...updated[index], [field]: value || "" } as TrainDetail;
    onUpdate(updated);
  };

  const getDefaultTrainData = () => {
    let trainNo = "";
    let departureLocation = "";
    let arrivalLocation = "";

    if (shift?.shiftTrain && shift.shiftTrain.length > 0) {
      const firstTrain = shift.shiftTrain[0];
      trainNo = firstTrain?.train_no || "";
      departureLocation = firstTrain?.departure_location || "";
      arrivalLocation = firstTrain?.arrival_location || "";
    } else if (
      (shift as any)?.usn_shift_route_planning &&
      (shift as any).usn_shift_route_planning.length > 0
    ) {
      const firstRoute = (shift as any).usn_shift_route_planning[0];
      trainNo = firstRoute.train_no || "";
      departureLocation =
        firstRoute.start_location?.name ||
        firstRoute.start_location_id?.toString() ||
        "";
      arrivalLocation =
        firstRoute.end_location?.name ||
        firstRoute.end_location_id?.toString() ||
        "";
    }

    return {
      train_no: trainNo,
      departure_location: departureLocation,
      departure_time: "",
      arrival_location: arrivalLocation,
      arrival_time: "",
      notice_of_completion: "",
      remarks: "",
    };
  };

  const addTrainDetail = () => {
    const defaultData = getDefaultTrainData();
    onUpdate([...trainDetails, defaultData]);
  };

  const removeTrainDetail = (index: number) => {
    if (trainDetails.length > 1) {
      const updated = trainDetails.filter((_, i) => i !== index);
      onUpdate(updated);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("trainDetails")}</h3>
        <button
          type="button"
          onClick={addTrainDetail}
          className="flex items-center gap-2 rounded-full text-green-700 p-1 mr-3"
        >
          <PlusCircle size={30} />
        </button>
      </div>

      {trainDetails.map((detail, index) => (
        <div key={index} className="border p-4 rounded-lg space-y-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {t("trainDetail")} {index + 1}
            </span>
            {trainDetails.length > 1 && (
              <button
                type="button"
                onClick={() => removeTrainDetail(index)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                aria-label={t("removeTrainDetail")}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SMSInput
              label={t("trainNumber")}
              value={detail.train_no}
              onChange={(e) =>
                handleInputChange(index, "train_no", e.target.value)
              }
              error={errors[index]?.train_no}
              placeholder={t("enterTrainNumber")}
            />
            <MapWithSearch
              label={t("departureLocation")}
              placeholder={t("enterDepartureLocation")}
              value={detail.departure_location}
              onChange={(e) =>
                handleInputChange(index, "departure_location", e.target.value)
              }
              error={errors[index]?.departure_location}
            />
            <SMSInput
              label={t("departureTime")}
              type="time"
              value={detail.departure_time}
              onChange={(e) =>
                handleInputChange(index, "departure_time", e.target.value)
              }
              error={errors[index]?.departure_time}
            />
            <MapWithSearch
              label={t("arrivalLocation")}
              placeholder={t("enterArrivalLocation")}
              value={detail.arrival_location}
              onChange={(e) =>
                handleInputChange(index, "arrival_location", e.target.value)
              }
              error={errors[index]?.arrival_location}
            />
            <SMSInput
              label={t("arrivalTime")}
              type="time"
              value={detail.arrival_time}
              onChange={(e) =>
                handleInputChange(index, "arrival_time", e.target.value)
              }
              error={errors[index]?.arrival_time}
            />
            <SMSInput
              label={t("noticeOfCompletion")}
              value={detail.notice_of_completion}
              onChange={(e) =>
                handleInputChange(index, "notice_of_completion", e.target.value)
              }
              error={errors[index]?.notice_of_completion}
              placeholder={t("enterNoticeOfCompletion")}
            />
          </div>
          <SMSInput
            label={t("remarks")}
            value={detail.remarks}
            onChange={(e) =>
              handleInputChange(index, "remarks", e.target.value)
            }
            error={errors[index]?.remarks}
            placeholder={t("enterRemarks")}
          />
        </div>
      ))}
    </div>
  );
};

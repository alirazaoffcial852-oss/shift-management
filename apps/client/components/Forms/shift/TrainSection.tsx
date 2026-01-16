import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@workspace/ui/components/switch";
import { TrainSectionProps } from "./types/form";
import MapWithSearch from "@/components/Map";
import { useTranslations } from "next-intl";

export function TrainSection({ shifts, onUpdate, errors }: TrainSectionProps) {
  const t = useTranslations("pages.shift");

  const addNewTrain = () => {
    const newTrains = [
      ...(shifts.shiftTrain || []),
      {
        train_no: "",
        departure_location: "",
        arrival_location: "",
        isEnabled: true,
        freight_transport: false,
      },
    ];
    onUpdate(newTrains);
  };

  const removeTrain = (index: number) => {
    const newTrains = shifts.shiftTrain?.filter((_, i) => i !== index);
    onUpdate(newTrains || []);
  };

  const updateTrain = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    console.log(`Updating train ${index}, ${field} to:`, value);
    const newTrains = shifts.shiftTrain?.map((train, i) => {
      if (i === index) {
        return { ...train, [field]: value };
      }
      return train;
    });
    onUpdate(newTrains || []);
  };

  return (
    <div className="space-y-4">
      {shifts.shiftTrain?.map((train, index) => (
        <div key={index}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h3>{t("train_no")}</h3>
              <Switch
                checked={train.isEnabled !== false}
                onCheckedChange={(checked) =>
                  updateTrain(index, "isEnabled", checked)
                }
              />
              <p className="text-[10px] font-semibold">
                {train.isEnabled !== false ? t("enabled") : t("disabled")}
              </p>
            </div>
            <div className="flex items-start justify-end">
              {(shifts.shiftTrain?.length ?? 0) > 1 && (
                <Trash2
                  className="h-5 w-5 cursor-pointer text-red-500"
                  onClick={() => removeTrain(index)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
            <SMSInput
              label=""
              placeholder={t("enter_train_number")}
              value={train.train_no}
              onChange={(e) => updateTrain(index, "train_no", e.target.value)}
              disabled={train.isEnabled === false}
              error={errors[`shiftTrain.${index}.train_no`]}
            />
            <div>
              <MapWithSearch
                label=""
                placeholder={t("enter_departure_location")}
                value={train.departure_location}
                onChange={(e) =>
                  updateTrain(index, "departure_location", e.target.value)
                }
                disabled={train.isEnabled === false}
                error={errors[`shiftTrain.${index}.departure_location`]}
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <MapWithSearch
                label=""
                placeholder={t("enter_arrival_location")}
                value={train.arrival_location}
                onChange={(e) =>
                  updateTrain(index, "arrival_location", e.target.value)
                }
                disabled={train.isEnabled === false}
                error={errors[`shiftTrain.${index}.arrival_location`]}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-2 border rounded-lg bg-gray-50">
              <Switch
                checked={train.freight_transport === true}
                onCheckedChange={(checked) =>
                  updateTrain(index, "freight_transport", checked)
                }
              />
              <span className="text-sm font-medium text-gray-700">
                {t("freightTransportOption")}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-6">
        <SMSButton
          type="button"
          variant="outline"
          onClick={addNewTrain}
          className="flex items-center gap-2 bg-white border-0 w-80 rounded-lg text-[#3E8258] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>{t("add_more")}</span>
          </span>
        </SMSButton>
      </div>
    </div>
  );
}

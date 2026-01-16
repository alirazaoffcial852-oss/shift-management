"use client";
import type React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { useReasonTable } from "@/hooks/reason/useReasonTable";
import {
  Action,
  ActionFormErrors,
  ActionFormProps,
} from "@/types/locomotiveAction";
import LocomotiveActionService from "../../services/locomotiveAction";
import { useTranslations } from "next-intl";

interface ActionFormState {
  locomotive_id: number | undefined;
  actionName: string;
  cycleIndicator: string;
  whenStateIsYellow: string;
  whenStateIsRed: string;
  reason_id: number | null;
}

const ActionForm: React.FC<ActionFormProps> = ({
  id,
  onclose,
  isDialog = false,
  onSubmit,
}) => {
  const [actions, setActions] = useState<ActionFormState[]>([
    {
      locomotive_id: id,
      actionName: "",
      cycleIndicator: "",
      whenStateIsYellow: "",
      whenStateIsRed: "",
      reason_id: null,
    },
  ]);

  const [errors, setErrors] = useState<ActionFormErrors[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("common");
  const tmaintenance = useTranslations("pages.maintenance");

  const { reasons } = useReasonTable();

  const handleInputChange = (
    index: number,
    field: keyof ActionFormState,
    value: string
  ) => {
    const safeValue = value ?? "";

    setActions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: safeValue,
      } as ActionFormState;
      return updated;
    });
  };

  const addActionEntry = () => {
    setActions((prev) => [
      ...prev,
      {
        locomotive_id: id,
        actionName: "",
        cycleIndicator: "",
        whenStateIsYellow: "",
        whenStateIsRed: "",
        reason_id: null,
      },
    ]);
  };

  const removeActionEntry = (index: number) => {
    if (actions.length > 1) {
      setActions((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const convertToActions = (formActions: ActionFormState[]): Action[] => {
    return formActions.map((action) => ({
      locomotive_id: id || 0,
      actionName: action.actionName,
      cycleIndicator: parseInt(action.cycleIndicator),
      whenStateIsYellow: parseInt(action.whenStateIsYellow),
      whenStateIsRed: parseInt(action.whenStateIsRed),
      reason_id: action.reason_id || 0,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ActionFormErrors[] = [];
    let hasErrors = false;

    actions.forEach((action, index) => {
      const actionErrors: ActionFormErrors = {
        locomotive_id: 0,
        reason_id: 0,
      };

      if (!action.actionName.trim()) {
        actionErrors.actionName = t("action_name_required");
        hasErrors = true;
      }

      const cycleIndicator = parseInt(action.cycleIndicator);
      const yellowThreshold = parseInt(action.whenStateIsYellow);
      const redThreshold = parseInt(action.whenStateIsRed);

      if (
        !action.cycleIndicator ||
        isNaN(cycleIndicator) ||
        cycleIndicator <= 0
      ) {
        actionErrors.cycleIndicator = t("valid_cycle_indicator_required");
        hasErrors = true;
      }

      if (
        !action.whenStateIsYellow ||
        isNaN(yellowThreshold) ||
        yellowThreshold <= 0
      ) {
        actionErrors.whenStateIsYellow = t("valid_yellow_state_required");
        hasErrors = true;
      } else if (!isNaN(cycleIndicator) && yellowThreshold >= cycleIndicator) {
        actionErrors.whenStateIsYellow = t("yellow_state_less_than_cycle");
        hasErrors = true;
      }

      if (!action.whenStateIsRed || isNaN(redThreshold) || redThreshold <= 0) {
        actionErrors.whenStateIsRed = t("valid_red_state_required");
        hasErrors = true;
      } else if (!isNaN(yellowThreshold) && redThreshold >= yellowThreshold) {
        actionErrors.whenStateIsRed = t("red_state_less_than_yellow");
        hasErrors = true;
      }

      if (
        !isNaN(cycleIndicator) &&
        !isNaN(redThreshold) &&
        redThreshold >= cycleIndicator
      ) {
        actionErrors.whenStateIsRed = t("red_state_less_than_cycle");
        hasErrors = true;
      }

      if (!action.reason_id) {
        actionErrors.reason_id = 1;
        hasErrors = true;
      }

      newErrors.push(actionErrors);
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const convertedActions = convertToActions(actions);

      const response =
        await LocomotiveActionService.createLocomotiveAction(convertedActions);

      if (onSubmit) {
        await onSubmit(convertedActions);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (onclose) {
        onclose();
      }
    } catch (error) {
      console.error("Error saving actions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${isDialog ? "flex flex-col h-full" : ""}`}>
      <form
        onSubmit={handleSubmit}
        className={`${isDialog ? "flex flex-col h-full" : "space-y-6"}`}
      >
        <div
          className={`${
            isDialog
              ? "flex-1 overflow-y-auto space-y-6 pr-2 pb-4"
              : "space-y-6"
          }`}
        >
          {actions.map((action, index) => (
            <div key={index} className="p-2 sm:p-4 mb-4 rounded-lg">
              <div className="block md:hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {actions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActionEntry(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label={t("remove_action")}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    {index === actions.length - 1 && (
                      <button
                        type="button"
                        onClick={addActionEntry}
                        className="text-green-600 hover:text-green-800 p-2"
                        aria-label={t("add_action")}
                      >
                        <PlusCircle size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <SMSInput
                    label={t("action_name")}
                    value={action.actionName}
                    onChange={(e) =>
                      handleInputChange(index, "actionName", e.target.value)
                    }
                    required
                    error={errors[index]?.actionName}
                    placeholder={t("enter_action_name")}
                    maxLength={100}
                  />
                  <SMSInput
                    label={t("cycle_indicator")}
                    placeholder={`365 ${t("days")}`}
                    type="number"
                    value={action.cycleIndicator}
                    onChange={(e) =>
                      handleInputChange(index, "cycleIndicator", e.target.value)
                    }
                    required
                    error={errors[index]?.cycleIndicator}
                  />
                  <SMSInput
                    label={t("when_state_is_yellow")}
                    placeholder={`120 ${t("days")}`}
                    type="number"
                    value={action.whenStateIsYellow}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "whenStateIsYellow",
                        e.target.value
                      )
                    }
                    required
                    error={errors[index]?.whenStateIsYellow}
                  />
                  <SMSInput
                    label={t("when_state_is_red")}
                    placeholder={`14 ${t("days")}`}
                    type="number"
                    value={action.whenStateIsRed}
                    onChange={(e) =>
                      handleInputChange(index, "whenStateIsRed", e.target.value)
                    }
                    required
                    error={errors[index]?.whenStateIsRed}
                  />
                  <SMSCombobox
                    label={t("select_reason")}
                    placeholder={t("select_a_reason")}
                    searchPlaceholder={t("search_reasons")}
                    value={action.reason_id?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange(index, "reason_id", value)
                    }
                    options={reasons.map((r) => ({
                      value: String(r.id),
                      label: r.reason,
                    }))}
                  />
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <SMSInput
                      label={t("action_name")}
                      value={action.actionName}
                      onChange={(e) =>
                        handleInputChange(index, "actionName", e.target.value)
                      }
                      required
                      error={errors[index]?.actionName}
                      placeholder={t("enter_action_name")}
                      maxLength={100}
                    />
                    <SMSInput
                      label={t("cycle_indicator")}
                      placeholder={`365 ${t("days")}`}
                      type="number"
                      value={action.cycleIndicator}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "cycleIndicator",
                          e.target.value
                        )
                      }
                      required
                      error={errors[index]?.cycleIndicator}
                    />
                    <SMSInput
                      label={t("when_state_is_yellow")}
                      placeholder={`120 ${t("days")}`}
                      type="number"
                      value={action.whenStateIsYellow}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "whenStateIsYellow",
                          e.target.value
                        )
                      }
                      required
                      error={errors[index]?.whenStateIsYellow}
                    />
                    <SMSInput
                      label={t("when_state_is_red")}
                      placeholder={`14 ${t("days")}`}
                      type="number"
                      value={action.whenStateIsRed}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "whenStateIsRed",
                          e.target.value
                        )
                      }
                      required
                      error={errors[index]?.whenStateIsRed}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-8 min-w-[80px]">
                    {actions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActionEntry(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        aria-label={t("remove_action")}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                    {index === actions.length - 1 && (
                      <button
                        type="button"
                        onClick={addActionEntry}
                        className="text-green-600 hover:text-green-800"
                        aria-label={t("add_action")}
                      >
                        <PlusCircle size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 flex-1 max-w-60">
                  <SMSCombobox
                    label={t("select_reason")}
                    placeholder={t("select_a_reason")}
                    searchPlaceholder={t("search_reasons")}
                    value={action.reason_id?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange(index, "reason_id", value)
                    }
                    options={reasons.map((r) => ({
                      value: String(r.id),
                      label: r.reason,
                    }))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${
            isDialog
              ? "flex-shrink-0 sticky bottom-0 bg-white pt-4 pb-2"
              : "mt-8"
          } flex justify-center px-2`}
        >
          <SMSButton
            className="bg-black rounded-full w-full sm:w-auto min-w-[120px]"
            type="submit"
            loading={loading}
            loadingText={t("buttons.save")}
            text={t("buttons.save")}
          />
        </div>
      </form>
    </div>
  );
};

export default ActionForm;

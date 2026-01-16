"use client";
import type React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useReasonTable } from "@/hooks/reason/useReasonTable";
import {
  Action,
  ActionFormErrors,
  ActionFormProps,
} from "@/types/locomotiveAction";
import LocomotiveActionService from "../../services/locomotiveAction";

interface EditActionFormState {
  actionName: string;
  cycleIndicator: string;
  whenStateIsYellow: string;
  whenStateIsRed: string;
  reason_id: number | null;
  completionDate?: string;
}

const EditActionForm: React.FC<ActionFormProps> = ({
  id,
  onclose,
  isDialog = false,
  onSubmit,
  type = "add",
  actionId,
}) => {
  const [actions, setActions] = useState<EditActionFormState[]>([
    {
      actionName: "",
      cycleIndicator: "",
      whenStateIsYellow: "",
      whenStateIsRed: "",
      reason_id: null,
      completionDate: "",
    },
  ]);

  const [errors, setErrors] = useState<ActionFormErrors[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const { reasons } = useReasonTable();

  useEffect(() => {
    const fetchActionData = async () => {
      if (type === "edit" && actionId) {
        setInitialLoading(true);
        try {
          const response =
            await LocomotiveActionService.getLocomotiveActionId(actionId);
          const actionData = response.data;
          if (actionData) {
            setActions([
              {
                actionName: actionData.action_name || "",
                cycleIndicator:
                  actionData.cycle_indicator_days?.toString() || "",
                whenStateIsYellow:
                  actionData.yellow_threshold_days?.toString() || "",
                whenStateIsRed: actionData.red_threshold_days?.toString() || "",
                reason_id: actionData.reason_id || null,
                completionDate:
                  actionData.completions?.[0]?.completion_date || "",
              },
            ]);
          }
        } catch (error) {
          console.error("Error fetching action data:", error);
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchActionData();
  }, [type, actionId]);

  const handleInputChange = (
    index: number,
    field: keyof EditActionFormState,
    value: string
  ) => {
    const safeValue = value ?? "";

    setActions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: safeValue,
      } as EditActionFormState;
      return updated;
    });

    if (errors[index]?.[field as keyof ActionFormErrors]) {
      setErrors((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          delete updated[index]![field as keyof ActionFormErrors];
        }
        return updated;
      });
    }
  };

  const convertToActions = (formActions: EditActionFormState[]): Action[] => {
    return formActions.map((action) => ({
      actionName: action.actionName,
      cycleIndicator: parseInt(action.cycleIndicator),
      whenStateIsYellow: parseInt(action.whenStateIsYellow),
      whenStateIsRed: parseInt(action.whenStateIsRed),
      reason_id: action.reason_id || 0,
      completion_date: action.completionDate,
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
        actionErrors.actionName = "Action name is required";
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
        actionErrors.cycleIndicator =
          "Valid cycle indicator is required (must be greater than 0)";
        hasErrors = true;
      }

      if (
        !action.whenStateIsYellow ||
        isNaN(yellowThreshold) ||
        yellowThreshold <= 0
      ) {
        actionErrors.whenStateIsYellow =
          "Valid yellow state value is required (must be greater than 0)";
        hasErrors = true;
      } else if (!isNaN(cycleIndicator) && yellowThreshold >= cycleIndicator) {
        actionErrors.whenStateIsYellow =
          "Yellow state must be less than cycle indicator";
        hasErrors = true;
      }

      if (!action.whenStateIsRed || isNaN(redThreshold) || redThreshold <= 0) {
        actionErrors.whenStateIsRed =
          "Valid red state value is required (must be greater than 0)";
        hasErrors = true;
      } else if (!isNaN(yellowThreshold) && redThreshold >= yellowThreshold) {
        actionErrors.whenStateIsRed =
          "Red state must be less than yellow state";
        hasErrors = true;
      }

      if (
        !isNaN(cycleIndicator) &&
        !isNaN(redThreshold) &&
        redThreshold >= cycleIndicator
      ) {
        actionErrors.whenStateIsRed =
          "Red state must be less than cycle indicator";
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

      let response;
      if (
        type === "edit" &&
        actionId &&
        convertedActions &&
        convertedActions.length > 0
      ) {
        response = await LocomotiveActionService.updateLocomotiveAction(
          actionId,
          convertedActions[0]!
        );
      }

      if (onSubmit) {
        await onSubmit(convertedActions);
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

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading action data...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center justify-between mb-4"></div>

              <div className="block md:hidden">
                <div className="space-y-4">
                  <SMSInput
                    label="Action Name"
                    value={action.actionName}
                    onChange={(e) =>
                      handleInputChange(index, "actionName", e.target.value)
                    }
                    required
                    error={errors[index]?.actionName}
                    placeholder="Enter action name"
                    maxLength={100}
                  />
                  <SMSInput
                    label="Cycle Indicator"
                    placeholder="365"
                    type="number"
                    value={action.cycleIndicator}
                    onChange={(e) =>
                      handleInputChange(index, "cycleIndicator", e.target.value)
                    }
                    required
                    error={errors[index]?.cycleIndicator}
                  />
                  <SMSInput
                    label="When State is Yellow"
                    placeholder="120"
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
                    label="When State is Red"
                    placeholder="14"
                    type="number"
                    value={action.whenStateIsRed}
                    onChange={(e) =>
                      handleInputChange(index, "whenStateIsRed", e.target.value)
                    }
                    required
                    error={errors[index]?.whenStateIsRed}
                  />
                  {actions[0]?.completionDate && (
                    <SMSInput
                      label="Completion Date"
                      placeholder="120"
                      type="date"
                      value={actions[0]?.completionDate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "completionDate",
                          e.target.value
                        )
                      }
                      required
                    />
                  )}
                  <SMSCombobox
                    label="Select Reason"
                    placeholder="Select a reason"
                    searchPlaceholder="Search reasons..."
                    value={action.reason_id?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange(index, "reason_id", value)
                    }
                    options={reasons.map((r) => ({
                      value: String(r.id),
                      label: r.reason,
                    }))}
                    error={
                      errors[index]?.reason_id
                        ? "Please select a reason"
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="hidden md:block">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <SMSInput
                    label="Action Name"
                    value={action.actionName}
                    onChange={(e) =>
                      handleInputChange(index, "actionName", e.target.value)
                    }
                    required
                    error={errors[index]?.actionName}
                    placeholder="Enter action name"
                    maxLength={100}
                  />
                  <SMSInput
                    label="Cycle Indicator"
                    placeholder="365"
                    type="number"
                    value={action.cycleIndicator}
                    onChange={(e) =>
                      handleInputChange(index, "cycleIndicator", e.target.value)
                    }
                    required
                    error={errors[index]?.cycleIndicator}
                  />
                  <SMSInput
                    label="When State is Yellow"
                    placeholder="120"
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
                    label="When State is Red"
                    placeholder="14"
                    type="number"
                    value={action.whenStateIsRed}
                    onChange={(e) =>
                      handleInputChange(index, "whenStateIsRed", e.target.value)
                    }
                    required
                    error={errors[index]?.whenStateIsRed}
                  />
                  {actions[0]?.completionDate && (
                    <SMSInput
                      label="Completion Date"
                      placeholder="120"
                      type="date"
                      value={actions[0]?.completionDate || ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "completionDate",
                          e.target.value
                        )
                      }
                      required
                    />
                  )}
                  <SMSCombobox
                    label="Select Reason"
                    placeholder="Select a reason"
                    searchPlaceholder="Search reasons..."
                    value={action.reason_id?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange(index, "reason_id", value)
                    }
                    options={reasons.map((r) => ({
                      value: String(r.id),
                      label: r.reason,
                    }))}
                    error={
                      errors[index]?.reason_id
                        ? "Please select a reason"
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${
            isDialog
              ? "flex-shrink-0 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200"
              : "mt-8"
          } flex justify-center px-2`}
        >
          <SMSButton
            className="bg-black hover:bg-gray-800 rounded-full w-full sm:w-auto min-w-[120px] transition-colors"
            type="submit"
            loading={loading}
            loadingText={type === "edit" ? "Updating..." : "Saving..."}
            text={type === "edit" ? "Update Action" : "Save Actions"}
          />
        </div>
      </form>
    </div>
  );
};

export default EditActionForm;

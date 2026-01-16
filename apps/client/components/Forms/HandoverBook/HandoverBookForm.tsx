"use client";
import React from "react";
import ShiftsList from "@/components/Shift/ShiftList";
import SMSBackButton from "@workspace/ui/components/custom/SMSBackButton";
import { useHandoverBookForm } from "@/hooks/handoverBook/useHandoverBookForm";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import SignaturePad from "@/components/SignaturePad";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface HandoverBookFormProps {
  handoverBookId?: string;
  isUSN?: boolean;
}

const HandoverBookForm = ({
  handoverBookId,
  isUSN: isUSNProp,
}: HandoverBookFormProps = {}) => {
  const t = useTranslations("common");
  const {
    formData,
    errors,
    isSubmitting,
    isLoading,
    selectedShiftIndex,
    selectedShifts,
    signatureModalOpen,
    setSignatureModalOpen,
    handleInputChange,
    handleCheckChange,
    handleCoolantOilChange,
    handleSignature,
    handleSubmit,
    switchSelectedShift,
    isUSN,
    isEditMode,
  } = useHandoverBookForm({ handoverBookId, isUSNMode: isUSNProp });

  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      return format(date, "HH:mm");
    } catch {
      return timeString;
    }
  };

  const shiftOptions =
    selectedShifts.length > 0
      ? selectedShifts.map((shift) => ({
          value: shift.id?.toString() || "",
          label: `${format(new Date(shift.date || new Date()), "yyyy-MM-dd")} - ${formatTime(shift.start_time)} to ${formatTime(shift.end_time)}`,
        }))
      : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      {(selectedShifts.length > 0 || isEditMode) && (
        <div className="container mx-auto w-[95%] max-w-7xl bg-white shadow-lg rounded-xl my-6 mt-14">
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-5 rounded-t-xl">
            <div className="flex items-center gap-4 mb-4">
              <SMSBackButton />
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode
                  ? t("editHandoverBookDocument")
                  : t("createHandoverBookDocument")}
              </h1>
            </div>

            {!isEditMode && (
              <ShiftsList
                selectedShifts={selectedShifts}
                selectedShiftIndex={selectedShiftIndex}
                switchSelectedShift={switchSelectedShift}
              />
            )}
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                {t("generalInformation")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SMSInput
                  label={t("locomotive")}
                  value={formData.locomotiveNumber}
                  onChange={(e) =>
                    handleInputChange("locomotiveNumber", e.target.value)
                  }
                  error={errors.locomotiveNumber}
                  required
                  disabled
                />

                <SMSCombobox
                  label={t("shift")}
                  placeholder={t("selectShift")}
                  value={formData.shiftId?.toString() || ""}
                  onValueChange={(value) =>
                    handleInputChange("shiftId", parseInt(value) || null)
                  }
                  options={shiftOptions}
                  error={errors.shiftId}
                  required
                  disabled
                />

                <SMSInput
                  label={t("date")}
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  error={errors.date}
                  required
                />

                <SMSInput
                  label={t("trainDriverName")}
                  value={formData.trainDriverName}
                  onChange={(e) =>
                    handleInputChange("trainDriverName", e.target.value)
                  }
                  error={errors.trainDriverName}
                  disabled
                  required
                />

                <SMSInput
                  label={t("duty_start_time")}
                  type="datetime-local"
                  value={formData.dutyStartTime}
                  onChange={(e) =>
                    handleInputChange("dutyStartTime", e.target.value)
                  }
                  error={errors.dutyStartTime}
                  required
                  disabled
                />

                <SMSInput
                  label={t("duty_end_time")}
                  type="datetime-local"
                  value={formData.dutyEndTime}
                  onChange={(e) =>
                    handleInputChange("dutyEndTime", e.target.value)
                  }
                  error={errors.dutyEndTime}
                  required
                  disabled
                />

                <SMSInput
                  label={t("location_start")}
                  value={formData.locationStart}
                  onChange={(e) =>
                    handleInputChange("locationStart", e.target.value)
                  }
                  error={errors.locationStart}
                  required
                  disabled
                />

                <SMSInput
                  label={t("location_end")}
                  value={formData.locationEnd}
                  onChange={(e) =>
                    handleInputChange("locationEnd", e.target.value)
                  }
                  disabled
                  error={errors.locationEnd}
                  required
                />

                <SMSInput
                  label={t("operatingStart")}
                  type="text"
                  value={formData.operatingStart}
                  onChange={(e) =>
                    handleInputChange("operatingStart", e.target.value)
                  }
                  error={errors.operatingStart}
                  required
                  placeholder={t("enterOperatingStartTime")}
                />

                <SMSInput
                  label={t("operatingEnd")}
                  type="text"
                  value={formData.operatingEnd}
                  onChange={(e) =>
                    handleInputChange("operatingEnd", e.target.value)
                  }
                  error={errors.operatingEnd}
                  required
                  placeholder={t("enterOperatingEndTime")}
                />

                <SMSInput
                  label={t("fuelLevelStart")}
                  type="number"
                  value={formData.fuelLevelStart?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      handleInputChange("fuelLevelStart", null);
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue)) {
                        const clampedValue = Math.min(Math.max(numValue, 0), 8);
                        handleInputChange("fuelLevelStart", clampedValue);
                      }
                    }
                  }}
                  error={errors.fuelLevelStart}
                  required
                  min="0"
                  max="8"
                />

                <SMSInput
                  label={t("fuelLevelEnd")}
                  type="number"
                  value={formData.fuelLevelEnd?.toString() || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      handleInputChange("fuelLevelEnd", null);
                    } else {
                      const numValue = parseInt(value);
                      if (!isNaN(numValue)) {
                        const clampedValue = Math.min(Math.max(numValue, 0), 8);
                        handleInputChange("fuelLevelEnd", clampedValue);
                      }
                    }
                  }}
                  error={errors.fuelLevelEnd}
                  required
                  min="0"
                  max="8"
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                {t("cleaningStatusRemarks")}
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <Checkbox
                      id="cleanSwept"
                      checked={formData.cleanSwept}
                      onCheckedChange={(checked) =>
                        handleInputChange("cleanSwept", checked)
                      }
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="cleanSwept"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {t("swept")}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <Checkbox
                      id="cleanTrashEmptied"
                      checked={formData.cleanTrashEmptied}
                      onCheckedChange={(checked) =>
                        handleInputChange("cleanTrashEmptied", checked)
                      }
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="cleanTrashEmptied"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {t("trashEmptied")}
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <Checkbox
                      id="cleanCockpitCleaning"
                      checked={formData.cleanCockpitCleaning}
                      onCheckedChange={(checked) =>
                        handleInputChange("cleanCockpitCleaning", checked)
                      }
                      className="h-5 w-5"
                    />
                    <Label
                      htmlFor="cleanCockpitCleaning"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      {t("cockpitCleaning")}
                    </Label>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="otherRemarks"
                    className="text-sm font-semibold text-gray-700 mb-2 block"
                  >
                    {t("otherRemarks")}
                  </Label>
                  <Textarea
                    className="w-full min-h-[100px] px-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    id="otherRemarks"
                    value={formData.otherRemarks}
                    onChange={(e) =>
                      handleInputChange("otherRemarks", e.target.value)
                    }
                    placeholder={t("enterAnyAdditionalRemarksOrNotes")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                  {t("workTypeShiftStart")}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {formData.checks
                    .filter((check) => check.section === "START_OF_SHIFT")
                    .map((check, sectionIndex) => {
                      const index = formData.checks.findIndex(
                        (c) => c === check
                      );
                      return (
                        <div
                          key={index}
                          className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                                {t("workType")}
                              </Label>
                              <div className="px-3 py-2 text-sm font-medium bg-blue-50 border border-blue-200 rounded-md text-gray-800">
                                {check.workType}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Checkbox
                                id={`check-ok-${index}`}
                                checked={check.isOk}
                                onCheckedChange={(checked) =>
                                  handleCheckChange(index, "isOk", checked)
                                }
                                className="h-5 w-5"
                              />
                              <Label
                                htmlFor={`check-ok-${index}`}
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                {t("ok")}
                              </Label>
                            </div>
                          </div>

                          {!check.isOk && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <SMSInput
                                  label={t("description")}
                                  value={check.descriptionIfNotOk || ""}
                                  onChange={(e) =>
                                    handleCheckChange(
                                      index,
                                      "descriptionIfNotOk",
                                      e.target.value
                                    )
                                  }
                                  error={
                                    errors[`checks.${index}.descriptionIfNotOk`]
                                  }
                                  required
                                />

                                <SMSInput
                                  label={t("reportedTo")}
                                  value={check.reportedTo || ""}
                                  onChange={(e) =>
                                    handleCheckChange(
                                      index,
                                      "reportedTo",
                                      e.target.value
                                    )
                                  }
                                  error={errors[`checks.${index}.reportedTo`]}
                                  required
                                />

                                <SMSInput
                                  label={t("status")}
                                  value={check.status || ""}
                                  onChange={(e) =>
                                    handleCheckChange(
                                      index,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                  error={errors[`checks.${index}.status`]}
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                  {t("workTypeShiftEnd")}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {formData.checks
                    .filter((check) => check.section === "END_OF_SHIFT")
                    .map((check, sectionIndex) => {
                      const index = formData.checks.findIndex(
                        (c) => c === check
                      );
                      return (
                        <div
                          key={index}
                          className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                                {t("workType")}
                              </Label>
                              <div className="px-3 py-2 text-sm font-medium bg-blue-50 border border-blue-200 rounded-md text-gray-800">
                                {check.workType}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Checkbox
                                id={`check-ok-${index}`}
                                checked={check.isOk}
                                onCheckedChange={(checked) =>
                                  handleCheckChange(index, "isOk", checked)
                                }
                                className="h-5 w-5"
                              />
                              <Label
                                htmlFor={`check-ok-${index}`}
                                className="text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                {t("ok")}
                              </Label>
                            </div>
                          </div>

                          {!check.isOk && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <SMSInput
                                  label={t("description")}
                                  value={check.descriptionIfNotOk || ""}
                                  onChange={(e) =>
                                    handleCheckChange(
                                      index,
                                      "descriptionIfNotOk",
                                      e.target.value
                                    )
                                  }
                                  error={
                                    errors[`checks.${index}.descriptionIfNotOk`]
                                  }
                                  required
                                />

                                <SMSInput
                                  label={t("reportedTo")}
                                  value={check.reportedTo || ""}
                                  onChange={(e) =>
                                    handleCheckChange(
                                      index,
                                      "reportedTo",
                                      e.target.value
                                    )
                                  }
                                  error={errors[`checks.${index}.reportedTo`]}
                                  required
                                />

                                <SMSInput
                                  label={t("status")}
                                  value={check.status || ""}
                                  onChange={(e) =>
                                    handleCheckChange(
                                      index,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                  error={errors[`checks.${index}.status`]}
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">
                {t("coolantOilValues")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <SMSInput
                  className="whitespace-nowrap"
                  label={t("coolantPercent")}
                  value={formData.coolantOilValues.coolantPercent}
                  onChange={(e) =>
                    handleCoolantOilChange("coolantPercent", e.target.value)
                  }
                  error={errors["coolantOilValues.coolantPercent"]}
                  required
                  type="number"
                  min="0"
                  max="100"
                />

                <SMSInput
                  className="whitespace-nowrap"
                  label={t("lubricantPercent")}
                  value={formData.coolantOilValues.lubricantPercent}
                  onChange={(e) =>
                    handleCoolantOilChange("lubricantPercent", e.target.value)
                  }
                  error={errors["coolantOilValues.lubricantPercent"]}
                  required
                  type="number"
                  min="0"
                  max="100"
                />

                <SMSInput
                  label={t("hydraulicsPercent")}
                  value={formData.coolantOilValues.hydraulicsPercent}
                  onChange={(e) =>
                    handleCoolantOilChange("hydraulicsPercent", e.target.value)
                  }
                  error={errors["coolantOilValues.hydraulicsPercent"]}
                  required
                  type="number"
                  min="0"
                  max="100"
                />

                <SMSInput
                  label={t("transmissionOilPercent")}
                  value={formData.coolantOilValues.transmissionOilPercent}
                  onChange={(e) =>
                    handleCoolantOilChange(
                      "transmissionOilPercent",
                      e.target.value
                    )
                  }
                  error={errors["coolantOilValues.transmissionOilPercent"]}
                  required
                  type="number"
                  min="0"
                  max="100"
                />

                <SMSInput
                  label={t("engineOilPercent")}
                  value={formData.coolantOilValues.engineOilPercent}
                  onChange={(e) =>
                    handleCoolantOilChange("engineOilPercent", e.target.value)
                  }
                  error={errors["coolantOilValues.engineOilPercent"]}
                  required
                  type="number"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <SMSButton
                onClick={() => setSignatureModalOpen(true)}
                disabled={isSubmitting}
                variant="outline"
              >
                {t("addSignature")}
              </SMSButton>
              <SMSButton
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.signature}
                loading={isSubmitting}
              >
                {isEditMode ? t("update") : t("submit")}
              </SMSButton>
            </div>
          </div>

          <Dialog
            open={signatureModalOpen}
            onOpenChange={setSignatureModalOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <h3 className="text-lg font-semibold mb-4">{t("addSignature")}</h3>
              <SignaturePad
                onSave={async (signature) => {
                  await handleSignature(signature);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default HandoverBookForm;

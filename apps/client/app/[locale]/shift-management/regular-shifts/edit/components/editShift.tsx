"use client";
import Navbar from "@/components/Navbar";
import { useShiftForm } from "@/hooks/shift/useShiftForm";
import { ShiftInformationForm } from "@/components/Forms/shift/ShiftInformation";
import React from "react";
import { Shift } from "@/types/shift";
import ShiftsList from "@/components/Shift/ShiftList";
import { useSearchParams } from "next/navigation";
import SMSBackButton from "@workspace/ui/components/custom/SMSBackButton";
import { ShiftDetail } from "@/components/Forms/shift/ShiftDetail";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { useTranslations } from "next-intl"; // Localization import

const EditShift = () => {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const {
    isSubmitting,
    currentStep,
    handleContinue,
    handleBack,
    handleSubmit,
    products,
    files,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    selectedShiftIndex,
    selectedShifts,
    switchSelectedShift,
    setSelectedShifts,
    currentErrors,
    handleDocumentRemoval,
  } = useShiftForm("EDIT");

  const t = useTranslations("pages.shift");

  const handleTimeChange = (
    field: "start_time" | "end_time",
    value: string
  ) => {
    setSelectedShifts((prev: Shift[]) => {
      const newShifts = [...prev];
      const currentShift = newShifts[selectedShiftIndex];
      if (!currentShift) return prev;
      newShifts[selectedShiftIndex] = {
        ...currentShift,
        [field]: value,
        shiftDetail: currentShift.shiftDetail,
      };

      return newShifts;
    });
  };

  return (
    <>
      {selectedShifts.length > 0 && (
        <div className="container mx-auto w-[80%] bg-white shadow p-6 rounded-[30px] my-2 mt-14">
          <div className="mb-6">
            <div className="flex items-center gap-10">
              <SMSBackButton />
              <h1 className="my-8">
                {action === "assign"
                  ? t("assign_shifts_title")
                  : t("edit_shifts_title")}{" "}
              </h1>
            </div>

            {selectedShifts.length > 1 && (
              <ShiftsList
                selectedShifts={selectedShifts}
                selectedShiftIndex={selectedShiftIndex}
                switchSelectedShift={switchSelectedShift}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SMSInput
              label={t("start_time_label")}
              type="time"
              value={
                selectedShifts[selectedShiftIndex].start_time?.toString() || ""
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTimeChange("start_time", e.target.value)
              }
              required
              error={currentErrors[`shifts[${currentStep}].start_time`]}
            />

            <SMSInput
              label={t("end_time_label")}
              type="time"
              value={
                selectedShifts[selectedShiftIndex].end_time?.toString() || ""
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTimeChange("end_time", e.target.value)
              }
              required
              error={currentErrors[`shifts[${currentStep}].end_time`]}
            />
          </div>

          <ShiftInformationForm
            shifts={selectedShifts[selectedShiftIndex]}
            onUpdate={(e) => {
              setSelectedShifts((prev: Shift[]) => {
                const newShifts: Shift[] = [...prev];
                newShifts[selectedShiftIndex] = e;
                return newShifts;
              });
            }}
            errors={currentErrors}
            onContinue={handleContinue}
            handleBack={handleBack}
            key={currentStep}
            products={products}
            useComponentAs={"EDIT"}
          />

          <ShiftDetail
            shifts={selectedShifts[selectedShiftIndex]}
            onUpdate={(e) => {
              setSelectedShifts((prev: Shift[]) => {
                const newShifts: Shift[] = [...prev];
                newShifts[selectedShiftIndex] = e;
                return newShifts;
              });
            }}
            products={products}
            handleBack={handleBack}
            onContinue={handleSubmit}
            isSubmitting={isSubmitting}
            errors={currentErrors}
            files={files || []}
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleFileInput={handleFileInput}
            removeFile={removeFile}
            useComponentAs={"EDIT"}
            handleDocumentRemoval={handleDocumentRemoval}
          />
        </div>
      )}
    </>
  );
};

export default EditShift;

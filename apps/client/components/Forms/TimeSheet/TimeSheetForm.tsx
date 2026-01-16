"use client";
import React, { useState } from "react";
import ShiftsList from "@/components/Shift/ShiftList";
import SMSBackButton from "@workspace/ui/components/custom/SMSBackButton";
import { useTimeSheet } from "@/hooks/timeSheet/useTimeSheetForm";
import { BasicInformationForm } from "./BasicInformationForm";
import MultiSelector from "@workspace/ui/components/custom/MultiSelector";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import SignaturePad from "@/components/SignaturePad";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { DropZone } from "@/components/FileUpload/DropZone";
import { FileList } from "@/components/FileUpload/FileList";
import { useTranslations } from "next-intl";

interface TimesheetDocument {
  id: number;
  document: string;
  created_at: string;
  updated_at: string;
}

const TimeSheetForm = () => {
  const t = useTranslations("timesheet");
  const [showEmployeeSelector, setShowEmployeeSelector] = useState<
    Record<number, boolean>
  >({});
  const [existingDocuments, setExistingDocuments] = useState<
    TimesheetDocument[]
  >([]);

  const {
    isSubmitting,
    handleSubmit,
    selectedShiftIndex,
    selectedShifts,
    switchSelectedShift,
    handleInputChange,
    currentErrors,
    copyToAllShifts,
    signatureModalOpen,
    setSignatureModalOpen,
    supervisorSignatureModalOpen,
    setSupervisorSignatureModalOpen,
    handleSignature,
    toggleTimesheetEnabled,
    isClient,
    selectedEmployees,
    handleEmployeeSelect,
    clientId,
    files,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    viewDocument,
  } = useTimeSheet();

  const handleCheckboxChange = (index: number) => {
    setShowEmployeeSelector((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRemoveExistingDocument = (documentId: number) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  return (
    <>
      {selectedShifts.length > 0 && (
        <div className="container mx-auto w-[80%] bg-white shadow p-6 rounded-[30px] my-2 mt-14">
          <div className="mb-10">
            <div className="flex items-center gap-10">
              <SMSBackButton />
              <h1 className="my-8">{t("createHeading")}</h1>
            </div>

            {!isClient && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-6">
                  <label className="text-sm font-medium">
                    {t("addTimesheetOnBehalfOf")}
                  </label>
                  {selectedShifts.map((shift, index) => (
                    <div key={shift.id} className="flex items-center mr-4">
                      <Checkbox
                        id={`show-employee-selector-${index}`}
                        checked={showEmployeeSelector[index] || false}
                        onCheckedChange={() => handleCheckboxChange(index)}
                        className="mr-1"
                      />
                      <label
                        htmlFor={`show-employee-selector-${index}`}
                        className="text-sm cursor-pointer"
                      >
                        {t("shift")} {index + 1}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ShiftsList
              selectedShifts={selectedShifts}
              selectedShiftIndex={selectedShiftIndex}
              switchSelectedShift={switchSelectedShift}
            />
          </div>

          {!isClient && showEmployeeSelector[selectedShiftIndex] && (
            <div className="mb-6">
              <MultiSelector
                label={t("selectEmployeeToAddTimesheet")}
                options={
                  selectedShifts[selectedShiftIndex]?.shiftRole
                    ?.filter(
                      (role) =>
                        role.employee_id?.toString() !== clientId?.toString()
                    )
                    .map((role) => ({
                      label: role.employee?.name || "",
                      value: role.employee_id,
                    })) || []
                }
                selected={selectedEmployees || []}
                onChange={(values) => {
                  console.log("MultiSelector onChange called with:", values);
                  handleEmployeeSelect(values);
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {selectedShifts[selectedShiftIndex]?.shiftRole?.map((role) => {
              const shift = selectedShifts[selectedShiftIndex];
              if (!shift) return null;
              if (!isClient && !selectedEmployees.includes(role.employee_id)) {
                return null;
              }
              console.log(role, "role");
              if (role?.has_submitted_timesheet) {
                return null;
              }

              return (
                <BasicInformationForm
                  key={role.employee_id}
                  shifts={shift}
                  employeeId={role.employee_id}
                  onUpdate={handleInputChange}
                  errors={currentErrors}
                  isSubmitting={isSubmitting}
                  handleSubmit={handleSubmit}
                  copyToAllShifts={copyToAllShifts}
                  signatureModalOpen={signatureModalOpen}
                  setSignatureModalOpen={setSignatureModalOpen}
                  handleSignature={handleSignature}
                  toggleTimesheetEnabled={toggleTimesheetEnabled}
                />
              );
            })}
          </div>
          <div className="!mt-[77px]">
            <div className="mt-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("documents")}</h3>
                <DropZone
                  dragActive={dragActive}
                  onDrag={handleDrag}
                  onDrop={handleDrop}
                  onFileSelect={handleFileInput}
                  multiple={true}
                />
                {existingDocuments && existingDocuments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      {t("existingDocuments")}
                    </h4>
                    {existingDocuments.map((doc: TimesheetDocument) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span className="text-xs md:text-sm truncate flex-1 mr-2">
                          {doc.document.split("/").pop() ||
                            `${t("documents")} ${doc.id}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingDocument(doc.id)}
                          className="text-red-500 hover:text-red-700 text-sm whitespace-nowrap"
                        >
                          {t("remove")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {files && files.length > 0 && (
                  <FileList
                    file={files}
                    onRemove={(index?: number) => removeFile(index as number)}
                    multiple={true}
                    onView={viewDocument}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <SMSButton
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {t("save")}
            </SMSButton>
            {!isClient && (
              <>
                <SMSButton
                  onClick={() => setSignatureModalOpen(true)}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  {t("addEmployeeSignature")}
                </SMSButton>
                <SMSButton
                  onClick={() => setSupervisorSignatureModalOpen(true)}
                  disabled={isSubmitting}
                  variant="outline"
                >
                  {t("addSupervisorSignature")}
                </SMSButton>
                <SMSButton
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {t("saveAndSubmit")}
                </SMSButton>
              </>
            )}
          </div>

          <Dialog
            open={signatureModalOpen}
            onOpenChange={setSignatureModalOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <h3 className="text-lg font-semibold mb-4">
                {t("addEmployeeSignature")}
              </h3>
              <SignaturePad
                onSave={async (signature) => {
                  await handleSignature(signature, "employee");
                }}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={supervisorSignatureModalOpen}
            onOpenChange={setSupervisorSignatureModalOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <h3 className="text-lg font-semibold mb-4">
                {t("addSupervisorSignature")}
              </h3>
              <SignaturePad
                onSave={async (signature) => {
                  await handleSignature(signature, "supervisor");
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default TimeSheetForm;

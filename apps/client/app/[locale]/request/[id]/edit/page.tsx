"use client";
import React from "react";
import { useEditTimesheet } from "@/hooks/timeSheet/useEditTimesheet";
import Navbar from "@/components/Navbar";
import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import SignaturePad from "@/components/SignaturePad";
import { EditTimesheetForm } from "@/components/Forms/TimeSheet/EditTimesheetForm";
import { useAuth } from "@/providers/appProvider";
import { Timesheet } from "@/types/timeSheet";

export default function EditTimesheet() {
  const { user } = useAuth();
  const isClient = user?.role?.name === "CLIENT";

  const {
    timesheet,
    isLoading,
    isSubmitting,
    signatureModalOpen,
    setSignatureModalOpen,
    handleInputChange,
    handleSignature,
    handleSubmit,
  } = useEditTimesheet();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto w-[80%] bg-white shadow p-6 rounded-[30px] my-2">
        <div className="flex items-center gap-10 mb-6">
          <SMSBackButton />
          <h1 className="text-2xl font-bold">Edit Timesheet</h1>
        </div>

        {timesheet && (
          <div className="space-y-6">
            <EditTimesheetForm
              timesheet={timesheet as Timesheet}
              onUpdate={handleInputChange}
              errors={{}}
            />

            <div className="flex justify-end gap-4">
              <SMSButton
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Save
              </SMSButton>
              {!isClient && (
                <SMSButton
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Save & Submit
                </SMSButton>
              )}
            </div>
          </div>
        )}

        <Dialog open={signatureModalOpen} onOpenChange={setSignatureModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <h3 className="text-lg font-semibold mb-4">Add Your Signature</h3>
            <SignaturePad onSave={handleSignature} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

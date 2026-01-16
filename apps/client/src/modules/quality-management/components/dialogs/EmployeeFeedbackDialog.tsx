"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import EmployeeFeedbackForm from "../forms/EmployeeFeedbackForm";

interface EmployeeFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainDriverName?: string;
  shantingAttendantName?: string;
  onSave?: (data: any) => void;
}

export default function EmployeeFeedbackDialog({
  open,
  onOpenChange,
  trainDriverName,
  shantingAttendantName,
  onSave,
}: EmployeeFeedbackDialogProps) {
  const handleSave = (data: any) => {
    onSave?.(data);
    // Don't close automatically - let parent handle closing
    // This allows batch saves to work properly
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] overflow-y-auto p-0 px-6 sm:px-[50px] md:px-[100px]">
        <EmployeeFeedbackForm
          trainDriverName={trainDriverName}
          shantingAttendantName={shantingAttendantName}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
}

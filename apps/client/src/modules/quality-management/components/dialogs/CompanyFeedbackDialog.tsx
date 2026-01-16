"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import CompanyFeedbackForm from "../forms/CompanyFeedbackForm";

interface CompanyFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName?: string;
  onSave?: (data: any) => void;
}

export default function CompanyFeedbackDialog({
  open,
  onOpenChange,
  companyName,
  onSave,
}: CompanyFeedbackDialogProps) {
  const handleSave = (data: any) => {
    onSave?.(data);
    // Don't close automatically - let parent handle closing
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] px-6 sm:px-[50px] md:px-[100px] flex flex-col overflow-hidden">
        <CompanyFeedbackForm companyName={companyName} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}

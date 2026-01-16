"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import CustomerFeedbackForm from "../forms/CustomerFeedbackForm";

interface CustomerFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName?: string;
  onSave?: (data: any) => void;
}

export default function CustomerFeedbackDialog({
  open,
  onOpenChange,
  customerName,
  onSave,
}: CustomerFeedbackDialogProps) {
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
        <CustomerFeedbackForm customerName={customerName} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}

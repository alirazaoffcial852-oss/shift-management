"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import ReceiveRequestForm from "@/components/Forms/ReceiveRequestForm";

interface ReceiveRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  request?: any;
  actionType: "APPROVE" | "REJECT";
  onSuccess?: () => void;
}

const ReceiveRequestDialog: React.FC<ReceiveRequestDialogProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  request,
  actionType,
  onSuccess,
}) => {
  const taction = useTranslations("actions");

  const handleFormClose = () => {
    onClose();
    onOpenChange(false);
  };

  const handleFormSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleFormClose();
  };

  const getDialogTitle = () => {
    switch (actionType) {
      case "APPROVE":
        return `${taction("approve")} ${taction("request")}`;
      case "REJECT":
        return `${taction("reject")} ${taction("request")}`;
      default:
        return null;
    }
  };

  const shouldShowForm = actionType === "APPROVE";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] overflow-y-auto px-[100px]">
        <DialogHeader>
          <DialogTitle className="w-full mx-auto text-center text-[36px] mb-[76px] mt-[16px]">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        {shouldShowForm && (
          <ReceiveRequestForm
            id={request?.id ? Number(request.id) : undefined}
            onclose={handleFormClose}
            isDialog={true}
            requestData={request}
            onSuccess={handleFormSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveRequestDialog;

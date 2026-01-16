"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import SendRequestForm from "@/components/Forms/SendRequestForm";
import { SendRequest } from "@/types/request";

interface SendRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: (request: SendRequest) => void;
  type: "add" | "edit";
  id?: string;
}

const SendRequestDialog: React.FC<SendRequestDialogProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  type,
  id,
}) => {
  const taction = useTranslations("actions");

  const t = useTranslations("pages.request");
  const getTitleText = () => {
    return type === "add"
      ? `${taction("send")} ${taction("request")}`
      : t("editRequest");
  };

  const handleFormClose = (request: SendRequest) => {
    onClose(request);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1100px] max-h-[90vh] overflow-y-auto px-[100px]">
        <DialogHeader>
          <DialogTitle className="w-full mx-auto text-center text-[36px] mb-[76px] mt-[16px]">
            {getTitleText()}
          </DialogTitle>
        </DialogHeader>
        <SendRequestForm
          useComponentAs={type === "add" ? "ADD" : "EDIT"}
          id={id ? Number(id) : undefined}
          onclose={handleFormClose}
          isDialog={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SendRequestDialog;

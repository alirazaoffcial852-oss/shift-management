"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import UploadDocumentForm from "@/components/Forms/UploadDocumentForm";

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  type: "add" | "edit";
  id?: string;
}

const UploadDocumentsDailog: React.FC<UploadDocumentDialogProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  type,
  id,
}) => {
  const tsidebar = useTranslations("pages.maintenance");

  const getTitleText = () => {
    return type === "add"
      ? tsidebar("UploadDocument")
      : tsidebar("EditDocument");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] overflow-y-auto px-[100px]">
        <DialogHeader>
          <DialogTitle className="w-full mx-auto text-center text-[36px] mb-[76px] mt-[16px]">
            {getTitleText()}
          </DialogTitle>
        </DialogHeader>
        <UploadDocumentForm onClose={onClose} id={Number(id)} type={type} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentsDailog;

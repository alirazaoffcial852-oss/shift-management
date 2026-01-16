"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import SampleForm from "@/components/Forms/SampleForm";
import { Sampling } from "@/types/Sampling";

interface SamplingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: (Sample: Sampling[] | Sampling) => void;
  type: "add" | "edit";
  id?: string;
}

const SamplingDialog: React.FC<SamplingDialogProps> = ({ isOpen, onOpenChange, onClose, type, id }) => {
  const taction = useTranslations("actions");
  const tsidebar = useTranslations("components.sidebar");

  const getTitleText = () => {
    return type === "add" ? `Let's ${taction("create")} ${tsidebar("sampling")}` : `Let's ${taction("edit")} ${tsidebar("sampling")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] px-6 sm:px-[50px] md:px-[100px] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 py-4">
          <DialogTitle className="w-full mx-auto text-center text-[28px] sm:text-[36px] mb-4 sm:mb-[76px] mt-[16px]">{getTitleText()}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pb-4">
          {type === "add" ? (
            <SampleForm useComponentAs="ADD" onclose={onClose} isDialog={true} />
          ) : (
            <SampleForm useComponentAs="EDIT" onclose={onClose} id={Number(id)} isDialog={true} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SamplingDialog;

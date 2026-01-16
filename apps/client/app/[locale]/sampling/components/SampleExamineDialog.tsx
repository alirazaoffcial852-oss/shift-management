"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { SampleExamine } from "@/types/Sampling";
import SampleExamineForm from "@/components/Forms/SampleExamineForm";

interface SamplingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: (Sample: SampleExamine) => void;
  type: "add" | "edit";
  id?: string;
}

const SampleExamineDialog: React.FC<SamplingDialogProps> = ({ isOpen, onOpenChange, onClose, type, id }) => {
  const tsidebar = useTranslations("components.sidebar");

  const getTitleText = () => {
    return type === "add" ? `Let's  ${tsidebar("examine")}` : `Let's  ${tsidebar("examine")} `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] overflow-y-auto px-[100px]">
        <DialogHeader>
          <DialogTitle className="w-full mx-auto text-center text-[36px] mb-[76px] mt-[16px]">{getTitleText()}</DialogTitle>
        </DialogHeader>
        <SampleExamineForm onClose={onClose} id={Number(id)} type={type} />
      </DialogContent>
    </Dialog>
  );
};

export default SampleExamineDialog;

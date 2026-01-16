"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import ActionForm from "@/components/Forms/ActionForm";

interface ActionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  type: "add" | "edit";
  id?: string;
}

const ActionDialog: React.FC<ActionDialogProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  type,
  id,
}) => {
  const taction = useTranslations("pages.maintenance");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] px-6 sm:px-[50px] md:px-[100px] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 py-4">
          <DialogTitle className="w-full mx-auto text-center text-[28px] sm:text-[36px] mb-4 sm:mb-[76px] mt-[16px]">
            {taction("LetCreateActions")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pb-4">
          <ActionForm onclose={onClose} isDialog={true} id={Number(id)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;

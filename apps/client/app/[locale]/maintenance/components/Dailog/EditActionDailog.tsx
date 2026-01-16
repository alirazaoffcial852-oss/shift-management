"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import EditActionForm from "@/components/Forms/EditActionForm";

interface EditActionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  type: "add" | "edit";
  id?: string;
  locomotiveId?: number;
}

const EditActionDialog: React.FC<EditActionDialogProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  type,
  id,
  locomotiveId,
}) => {
  const taction = useTranslations("pages.maintenance");

  const handleFormSubmit = async (actions: any[]) => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] px-6 sm:px-[50px] md:px-[100px] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 py-4 border-b border-gray-100">
          <DialogTitle className="w-full mx-auto text-center text-[28px] sm:text-[36px] mb-4 sm:mb-[76px] mt-[16px]">
            {taction("LetEditActions")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pb-4">
          <EditActionForm
            onclose={onClose}
            isDialog={true}
            id={locomotiveId || Number(id)}
            type={type}
            actionId={type === "edit" ? Number(id) : undefined}
            onSubmit={handleFormSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditActionDialog;

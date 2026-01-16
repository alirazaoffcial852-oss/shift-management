"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { useTranslations } from "next-intl";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  companyName,
}: DeleteConfirmationModalProps) {
  const t = useTranslations("common");
  const tSettings = useTranslations("pages.settings");
  const tActions = useTranslations("actions");
  const tMessages = useTranslations("messages");

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {tActions("delete")} {tSettings("company")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tMessages("deleteConfirm")} {tSettings("company")}{" "}
            {tMessages("commonMessage")} <strong>{companyName}</strong>?{" "}
            {tMessages("deleteWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className="rounded-lg">
            {tActions("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className=" rounded-lg">
            {tActions("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;

  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

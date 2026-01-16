import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import AddEmployee from "@/app/[locale]/(dashboard)/employees/add/components/AddEmployee";

interface AddEmployeeDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddEmployeeDialog = ({ open, onClose }: AddEmployeeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="min-w-[90vw] bg-white rounded-[32px] p-8">
        <AddEmployee onclose={onClose} isDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

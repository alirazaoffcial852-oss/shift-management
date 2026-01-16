import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import AddCustomer from "@/app/[locale]/(dashboard)/customers/add/components/AddCustomer";
import AddProject from "@/app/[locale]/(dashboard)/projects/add/components/AddProject";
interface AddProjectDialogProps {
  open: boolean;
  onClose: () => void;
}
export const AddProjectDialog = ({ open, onClose }: AddProjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => onClose()}>
      <DialogContent className="min-w-[90vw] bg-white rounded-[32px] p-8 min-h-[60vh]">
        <AddProject onclose={() => onClose()} isDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

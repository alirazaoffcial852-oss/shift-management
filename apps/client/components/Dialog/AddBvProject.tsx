import AddBvProject from "@/app/[locale]/(dashboard)/bv-projects/add/components/AddBvProject";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
interface AddBvProjectDialogProps {
  open: boolean;
  onClose: () => void;
}
export const AddBvProjectDialog = ({
  open,
  onClose,
}: AddBvProjectDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => onClose()}>
      <DialogContent className="min-w-[90vw] bg-white rounded-[32px] p-8">
        <AddBvProject onclose={() => onClose()} isDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

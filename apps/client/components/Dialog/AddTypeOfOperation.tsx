import AddTypeOfOperation from "@/app/[locale]/settings/type-of-operation/add/components/AddTypeOfOperation";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
interface AddTypeOfOperationDialogProps {
  open: boolean;
  onClose: () => void;
}
export const AddTypeOfOperationDialog = ({
  open,
  onClose,
}: AddTypeOfOperationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => onClose()}>
      <DialogContent className="min-w-[90vw] bg-white rounded-[32px] p-8">
        <AddTypeOfOperation onclose={() => onClose()} isDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

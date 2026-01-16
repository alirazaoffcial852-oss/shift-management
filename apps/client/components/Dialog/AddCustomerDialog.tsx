import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import AddCustomer from "@/app/[locale]/(dashboard)/customers/add/components/AddCustomer";
interface AddCustomerDialogProps {
  open: boolean;
  onClose: () => void;
}
export const AddCustomerDialog = ({
  open,
  onClose,
}: AddCustomerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => onClose()}>
      <DialogContent className="min-w-[90vw] bg-white rounded-[32px] p-8">
        <AddCustomer onclose={() => onClose()} isDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

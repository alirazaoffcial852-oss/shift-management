import AddBvProject from "@/app/[locale]/(dashboard)/bv-projects/add/components/AddBvProject";
import AddCostCenter from "@/app/[locale]/settings/cost-center/add/components/AddCostCenter";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
interface AddCostCenterDialogProps {
  open: boolean;
  onClose: () => void;
}
export const AddCostCenterDialog = ({
  open,
  onClose,
}: AddCostCenterDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => onClose()}>
      <DialogContent className="min-w-[90vw] bg-white rounded-[32px] p-8">
        <AddCostCenter onclose={() => onClose()} isDialog={true} />
      </DialogContent>
    </Dialog>
  );
};

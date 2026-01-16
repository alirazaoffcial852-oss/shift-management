import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Shift } from "@/types/shift";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { BasicInformationView } from "./BasicInformation";
import { ShiftInformationView } from "./ShiftInformation";
import { ShiftDetailView } from "./ShiftDetail";
import { useTranslations } from "next-intl";

interface ViewShiftProps {
  shift: Shift | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewShift = ({ shift, isOpen, onClose }: ViewShiftProps) => {
  const t = useTranslations("pages.shift");

  if (!shift) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-[800px]">
        <SheetHeader>
          <h2>{t("shift_detail")}</h2>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            <BasicInformationView shift={shift} />
            <ShiftInformationView shift={shift} />
            <ShiftDetailView shift={shift} />
          </div>
        </ScrollArea>

        <div className="flex justify-end mt-auto pt-4">
          <SMSButton
            onClick={onClose}
            variant="outline"
            className="rounded-xlg px-6"
          >
            Close
          </SMSButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};

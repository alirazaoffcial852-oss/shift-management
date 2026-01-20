import { Timesheet, TIMESHEET_STATUS } from "@/types/timeSheet";
import { ActionButton } from "@workspace/ui/components/custom/ActionButton";
import { Archive, Edit2Icon } from "lucide-react";
import TimeSheetService from "@/services/timeSheet";
import { toast } from "sonner";
import SignaturePad from "@/components/SignaturePad";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Check } from "lucide-react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Link from "next/link";

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => [
  {
    header: t("tableHeaders.employee"),
    accessor: "employee.name",
  },
  {
    header: t("tableHeaders.date"),
    accessor: "shift.date",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: t("tableHeaders.workTime"),
    accessor: "start_time",
    render: (value: string, row: any) => `${row.start_time} - ${row.end_time}`,
  },
  {
    header: t("tableHeaders.breakDuration"),
    accessor: "break_duration",
    render: (value: string) => `${value} min`,
  },
  {
    header: t("tableHeaders.customer"),
    accessor: "shift.customer.name",
  },
  {
    header: t("tableHeaders.project"),
    accessor: "shift.project.name",
    render: (value: string) => value || "No Project",
  },
  {
    header: t("tableHeaders.workType"),
    accessor: "work_type",
    render: (value: any, row: any) => {
      const types = [];
      if (row.is_night_shift) types.push("Night");
      if (row.is_holiday) types.push("Holiday");
      if (row.has_extra_hours) types.push("Overtime");
      return types.length > 0 ? types.join(", ") : "Regular";
    },
  },
  {
    header: t("tableHeaders.creationMethod"),
    accessor: "self_created",
    render: (value: boolean) => (value ? "Self Created" : "Admin Created"),
  },
  {
    header: t("tableHeaders.status"),
    accessor: "status",
  },
  {
    header: t("tableHeaders.createdDate"),
    accessor: "created_at",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: t("tableHeaders.lastUpdated"),
    accessor: "updated_at",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
];

export const COLUMNS = getColumns((key: string) => key);

interface BulkSubmitButtonProps {
  selectedIds: number[];
  onSubmitSuccess: () => void;
}

export const BulkSubmitButton: React.FC<BulkSubmitButtonProps> = ({
  selectedIds,
  onSubmitSuccess,
}) => {
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignature = async (signatureData: string) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("timesheet_ids", JSON.stringify(selectedIds));
      formData.append("signature", signatureData);

      const response = await TimeSheetService.submitTimeSheet(formData);
      toast.success(response?.message || "Timesheets submitted successfully");
      setSignatureModalOpen(false);
      onSubmitSuccess();
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SMSButton
        onClick={() => setSignatureModalOpen(true)}
        className="flex items-center gap-2 h-12"
        startIcon={<Check className="w-4 h-4" />}
      >
        Submit Timesheets ({selectedIds.length})
      </SMSButton>

      <Dialog
        open={signatureModalOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setSignatureModalOpen(open);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Add Your Signature</h3>
            <SignaturePad
              onSave={handleSignature}
              disabled={isSubmitting}
              preventCloseOnLeave={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Remove or modify the existing ACTIONS array since we're handling submission differently now
export const ACTIONS = [
  {
    label: "Edit",
    element: (timesheet: Timesheet) => (
      <Link
        href={`/time-sheet/${timesheet.id}/edit`}
        className="w-full block py-2 px-3 hover:bg-green-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Edit2Icon className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600">Edit</span>
        </span>
      </Link>
    ),
  },
];

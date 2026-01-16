import { Badge } from "@workspace/ui/components/badge";
import TimeSheetService from "@/services/timeSheet";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Check } from "lucide-react";

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => [
  {
    header: t("tableHeaders.employee"),
    accessor: "employee.name",
    render: (value: string) => <span className="font-medium">{value}</span>,
  },
  {
    header: t("tableHeaders.date"),
    accessor: "usn_shift.date",
    render: (value: string) => new Date(value).toLocaleDateString(),
  },
  {
    header: t("tableHeaders.shiftTime"),
    accessor: "start_time",
    render: (value: string, row: any) => `${row.start_time} - ${row.end_time}`,
  },
  {
    header: t("tableHeaders.breakDuration"),
    accessor: "break_duration",
    render: (value: string) => `${value} min`,
  },
  {
    header: t("tableHeaders.company"),
    accessor: "usn_shift.company.name",
  },
  {
    header: t("tableHeaders.status"),
    accessor: "status",
    render: (value: string) => {
      const statusColors = {
        SUBMITTED: "bg-blue-100 text-blue-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
        DRAFT: "bg-gray-100 text-gray-800",
      };

      return (
        <Badge
          className={`${statusColors[value as keyof typeof statusColors]} border-0`}
        >
          {value}
        </Badge>
      );
    },
  },
  {
    header: t("tableHeaders.createdBy"),
    accessor: "creator.name",
    render: (value: string) => (
      <span className="text-sm text-gray-600">{value || "N/A"}</span>
    ),
  },
  {
    header: t("tableHeaders.createdAt"),
    accessor: "created_at",
    render: (value: string) => (
      <span className="text-sm text-gray-600">
        {new Date(value).toLocaleDateString()}
      </span>
    ),
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
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBulkSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("timesheet_ids", JSON.stringify(selectedIds));
      const response = await TimeSheetService.submitUSTimeSheet(formData);
      toast.success(
        response?.message || "USN Timesheets submitted successfully"
      );
      setIsOpen(false);
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
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 h-12"
        startIcon={<Check className="w-4 h-4" />}
      >
        Submit ({selectedIds.length})
      </SMSButton>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to submit {selectedIds.length} selected USN
              timesheet(s)?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <SMSButton variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </SMSButton>
            <SMSButton onClick={handleBulkSubmit} disabled={isSubmitting}>
              Submit
            </SMSButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const ACTIONS = [];

import { TIMESHEET_STATUS } from "@/types/timeSheet";
import {
  Building,
  Calendar,
  Check,
  Clock,
  MapPin,
  User,
  X,
} from "lucide-react";
import TimeSheetService from "@/services/timeSheet";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";

type TranslationFunction = (key: string) => string;

export const getColumns = (t: TranslationFunction) => [
  {
    header: t("tableHeaders.employee"),
    accessor: "employee.name",
    render: (value: string, row: any) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
      </div>
    ),
  },
  {
    header: t("tableHeaders.date"),
    accessor: "usn_shift.date",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <span>{new Date(value).toLocaleDateString()}</span>
      </div>
    ),
  },
  {
    header: t("tableHeaders.shiftTime"),
    accessor: "start_time",
    render: (value: string, row: any) => (
      <div className="flex items-center gap-2">
        <span>
          {row.start_time} - {row.end_time}
        </span>
      </div>
    ),
  },
  {
    header: t("tableHeaders.breakDuration"),
    accessor: "break_duration",
    render: (value: string) => (
      <span className="text-sm text-gray-600">{value} min</span>
    ),
  },
  {
    header: t("tableHeaders.company"),
    accessor: "usn_shift.company.name",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <span>{value}</span>
      </div>
    ),
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

interface BulkActionButtonProps {
  selectedIds: number[];
  onSuccess: () => void;
}

export const BulkApproveButton: React.FC<BulkActionButtonProps> = ({
  selectedIds,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBulkApprove = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("timesheet_ids", JSON.stringify(selectedIds));
      formData.append("check_timesheet", "usn_shift_timesheet");
      const response = await TimeSheetService.approvedTimeSheet(formData);
      toast.success(
        response?.message || "USN Timesheets approved successfully"
      );
      setIsOpen(false);
      onSuccess();
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
        Approve ({selectedIds.length})
      </SMSButton>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to approve {selectedIds.length} selected USN
              timesheet(s)?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <SMSButton variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </SMSButton>
            <SMSButton onClick={handleBulkApprove} disabled={isSubmitting}>
              Approve
            </SMSButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const BulkRejectButton: React.FC<BulkActionButtonProps> = ({
  selectedIds,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBulkReject = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("timesheet_ids", JSON.stringify(selectedIds));
      formData.append("reason", reason);
      formData.append("check_timesheet", "usn_shift_timesheet");
      const response = await TimeSheetService.rejectTimeSheet(formData);
      toast.success(
        response?.message || "USN Timesheets rejected successfully"
      );
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SMSButton
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 h-12"
        startIcon={<X className="w-4 h-4" />}
      >
        Reject ({selectedIds.length})
      </SMSButton>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <div className="flex flex-col gap-4">
            <Label
              htmlFor="note"
              className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1 "
            >
              Reason for rejection
            </Label>
            <Textarea
              className="w-full min-h-[52px]  px-3 py-2 mt-2 text-gray-800 border rounded-lg focus:outline-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for rejection"
            />

            <div className="flex justify-end gap-2">
              <SMSButton variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </SMSButton>
              <SMSButton
                variant="destructive"
                onClick={handleBulkReject}
                disabled={!reason || isSubmitting}
              >
                Reject
              </SMSButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const BulkSubmitButton: React.FC<BulkActionButtonProps> = ({
  selectedIds,
  onSuccess,
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
      onSuccess();
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

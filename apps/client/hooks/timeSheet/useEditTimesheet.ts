import { useState, useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import TimeSheetService from "@/services/timeSheet";
import { useAuth } from "@/providers/appProvider";
import { IMAGE_URL } from "@/constants/env.constants";

interface Timesheet {
  signature?: string;
  [key: string]: any;
}

interface TimesheetDocument {
  id: number;
  document: string;
  created_at: string;
  updated_at: string;
}

export const useEditTimesheet = () => {
  const [timesheet, setTimesheet] = useState<Timesheet>({
    start_name: "",
    end_name: "",
    is_night_shift: false,
    is_holiday: false,
    has_extra_hours: false,
    extra_hours: 0,
    extra_hours_note: "",
    notes: "",
    signature: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const [existingDocuments, setExistingDocuments] = useState<
    TimesheetDocument[]
  >([]);
  const [removedDocumentIds, setRemovedDocumentIds] = useState<number[]>([]);
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isClient = user?.role?.name === "CLIENT";
  const isUSN = pathname?.includes("usn-shifts-timesheets");

  useEffect(() => {
    fetchTimesheet();
  }, [params.id, isUSN]);

  const fetchTimesheet = async () => {
    try {
      setIsLoading(true);
      const id = params?.id?.toString();
      if (!id) {
        throw new Error("Timesheet ID is required");
      }
      const response = isUSN
        ? await TimeSheetService.getUSTimeSheetById(id)
        : await TimeSheetService.getTimeSheetById(id);
      const data = await response.data;
      setTimesheet(data);

      if (isUSN) {
        const documents = data.usn_timesheet_document || data.documents || [];
        setExistingDocuments(documents);
      } else {
        const documents = data.timesheetDocs || data.documents || [];
        setExistingDocuments(documents);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setTimesheet((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignature = async (signature: string) => {
    setTimesheet((prev) => ({
      ...prev,
      signature: signature,
    }));
    setSignatureModalOpen(false);
  };

  // File handling functions for Documents
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingDocument = (documentId: number) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    setRemovedDocumentIds((prev) => [...prev, documentId]);
  };

  const viewDocument = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const handleSubmit = async (submit: boolean = false) => {
    try {
      const id = params?.id?.toString();
      if (!id) {
        throw new Error("Timesheet ID is required");
      }

      const totalDocuments =
        (existingDocuments?.length || 0) + (files?.length || 0);
      if (totalDocuments === 0) {
        toast.error("Please upload at least one document.");
        return;
      }


      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("start_time", timesheet.start_time);
      formData.append("end_time", timesheet.end_time);
      formData.append("break_duration", timesheet.break_duration || "");
      formData.append("is_night_shift", timesheet.is_night_shift);
      formData.append("is_holiday", timesheet.is_holiday);
      if (timesheet.has_extra_hours) {
        formData.append("extra_hours", timesheet.extra_hours);
        formData.append("extra_hours_note", timesheet.extra_hours_note);
      }
      formData.append("has_extra_hours", timesheet.has_extra_hours);
      formData.append("notes", timesheet.notes || "");
      if (!isClient && timesheet.signature) {
        formData.append("signature", timesheet.signature);
      }

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("documents", file);
        });
      }

      formData.append(
        "check_timesheet",
        isUSN ? "usn_shift_timesheet" : "regular_shift_timesheet"
      );

      if (removedDocumentIds.length > 0) {
        formData.append(
          "removed_document_ids",
          JSON.stringify(removedDocumentIds)
        );
      }

      const response = await TimeSheetService.updateTimeSheet(formData, id);
      toast.success(response.message || "Timesheet updated successfully");

      setFiles([]);
      setRemovedDocumentIds([]);

      router.push(
        `/time-sheet/${isUSN ? "usn-shifts-timesheets" : "regular-shifts-timesheets"}/submitted`
      );
    } catch (error) {
      toast.error((error as any)?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewExistingDocument = (documentPath: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:5051";
    const fullUrl = documentPath.startsWith("http")
      ? documentPath
      : `${baseUrl}/${documentPath}`;
    window.open(fullUrl, "_blank");
  };

  return {
    timesheet,
    isLoading,
    isSubmitting,
    signatureModalOpen,
    setSignatureModalOpen,
    handleInputChange,
    handleSignature,
    handleSubmit,
    files,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    viewDocument,
    existingDocuments,
    removeExistingDocument,
    viewExistingDocument,
  };
};

import { useState } from "react";
import { toast } from "sonner";
import LocomotiveActionService from "@/services/locomotiveAction";

export const useCompletionForm = (
  locomotive_action_id?: number,
  onClose?: () => void,
  type: "add" | "edit" = "add",
  removedDocs: number[] = [],
  setRemovedDocs?: (docs: number[]) => void
) => {
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateField = (field: string, value: string) => {
    if (!value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [field]: [
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        ],
      }));
      return false;
    }
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return true;
  };

  const validateForm = () => {
    let valid = true;
    if (!validateField("note", note)) valid = false;
    if (files.length === 0) {
      setErrors((prev) => ({
        ...prev,
        file: ["At least one image or PDF is required"],
      }));
      valid = false;
    }
    return valid;
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf"
    );

    if (selected.length) {
      setFiles((prev) => [...prev, ...selected]);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["file"];
        return newErrors;
      });
    } else {
      toast.error("Only image or PDF files are allowed.");
    }
  };

  const isValidFileType = (file: File) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    return allowedTypes.includes(file.type);
  };

  const handleFileInputUploadDocument = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected = Array.from(e.target.files ?? []).filter(isValidFileType);
    if (selected.length) {
      setFiles((prev) => [...prev, ...selected]);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["file"];
        return newErrors;
      });
    } else {
      toast.error("Only JPG, PNG, PDF, DOC, or DOCX files are allowed.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf"
    );
    if (droppedFiles.length) {
      setFiles((prev) => [...prev, ...droppedFiles]);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["file"];
        return newErrors;
      });
    }
  };

  const handleDropUploadDocument = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      isValidFileType
    );
    if (droppedFiles.length) {
      setFiles((prev) => [...prev, ...droppedFiles]);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["file"];
        return newErrors;
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (["dragenter", "dragover"].includes(e.type)) {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !locomotive_action_id) return;

    setIsLoading(true);
    try {
      if (type === "add") {
        await LocomotiveActionService.uploadDocuments(
          locomotive_action_id,
          note,
          files
        );
        toast.success("Document uploaded successfully!");
      } else {
        const numericRemovedDocs = removedDocs
          .map((doc) => Number(doc))
          .filter((doc) => !isNaN(doc));

        await LocomotiveActionService.updateDocuments(
          locomotive_action_id,
          note,
          files,
          numericRemovedDocs
        );
        toast.success("Document updated successfully!");
      }
      setNote("");
      setFiles([]);
      setRemovedDocs?.([]);
      setErrors({});
      onClose?.();
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    note,
    setNote,
    files,
    errors,
    isLoading,
    dragActive,
    handleFileInput,
    handleDrop,
    handleDrag,
    removeFile,
    handleSubmit,
    handleFileInputUploadDocument,
    handleDropUploadDocument,
  };
};

import { useState, useCallback, useEffect } from "react";
import { FileHandlerService } from "@/services/fileHandler";

interface UseWagonFileUploadProps {
  onFilesChange?: (files: File[]) => void;
  onExistingDocsChange?: (
    documents: string[],
    deletedIndexes?: number[]
  ) => void;
  initialFiles?: File[];
  existingDocuments?: string[];
}

export const useWagonFileUpload = ({
  onFilesChange,
  onExistingDocsChange,
  initialFiles = [],
  existingDocuments = [],
}: UseWagonFileUploadProps = {}) => {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [dragActive, setDragActive] = useState(false);
  const [existingDocs, setExistingDocs] = useState<string[]>(existingDocuments);
  const [deletedDocIndexes, setDeletedDocIndexes] = useState<number[]>([]);

  useEffect(() => {
    if (initialFiles.length > 0) {
      setFiles(initialFiles);
    }
  }, [initialFiles]);

  useEffect(() => {
    if (existingDocuments.length > 0) {
      setExistingDocs(existingDocuments);
    }
  }, [existingDocuments]);

  const updateFiles = useCallback(
    (newFiles: File[]) => {
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    },
    [onFilesChange]
  );

  const updateExistingDocs = useCallback(
    (newDocs: string[], deletedIndexes: number[] = []) => {
      setExistingDocs(newDocs);
      onExistingDocsChange?.(newDocs, deletedIndexes);
    },
    [onExistingDocsChange]
  );

  const handleFiles = (newFiles: File[]) => {
    const updatedFiles = FileHandlerService.handleFiles(files, newFiles);
    updateFiles(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    FileHandlerService.handleDrop(e, handleFiles);
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    updateFiles(updatedFiles);
  };

  const removeExistingDoc = (index: number) => {
    const updatedDeletedIndexes = [...deletedDocIndexes, index];
    setDeletedDocIndexes(updatedDeletedIndexes);

    const updatedDocs = existingDocs.filter((_, i) => i !== index);
    updateExistingDocs(updatedDocs, updatedDeletedIndexes);
  };

  return {
    files,
    existingDocs,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    removeExistingDoc,
    deletedDocIndexes,
  };
};

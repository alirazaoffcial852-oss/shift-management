"use client";

import React, { useRef, useState } from "react";
import { Label } from "@workspace/ui/components/label";
import {
  Upload,
  X,
  Paperclip,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface DocumentUploadProps {
  documents: File[];
  onFileUpload: (files: FileList | null) => void;
  onRemoveDocument: (index: number) => void;
  existingDocuments?: Array<{ id: number; document: string }>;
  onRemoveExistingDocument?: (documentId: number) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onFileUpload,
  onRemoveDocument,
  existingDocuments = [],
  onRemoveExistingDocument,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const t = useTranslations("pages.projectUsn.documentUpload");

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onFileUpload(e.target.files);
  };

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
    onFileUpload(e.dataTransfer.files);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (["pdf"].includes(extension || "")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || "")
    ) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else {
      return <FileIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const isImageFile = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
      extension || ""
    );
  };

  const viewNewDocument = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const viewExistingDocument = (doc: { id: number; document: string }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:5051";
    const url = `${baseUrl}/${doc.document}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-xl font-semibold">
            {t("heading")} <span className="text-red-500">*</span>
          </Label>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive
              ? "border-primary bg-[#3E82582E]"
              : "border-gray-300 bg-gray-50"
          }`}
          style={{
            borderStyle: "dashed",
            borderWidth: "2px",
            borderSpacing: "10px",
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#3E82582E] rounded-lg flex items-center justify-center">
                <Paperclip className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[#818285] font-medium">
                  {t("instruction")}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {t("supportedFormats")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUploadClick}
              className="px-6 py-4 bg-[#3E82582E] text-primary rounded-2xl flex items-center space-x-2 hover:bg-primary hover:text-white transition-colors font-medium"
            >
              <Upload className="h-4 w-4" />
              <span>{t("uploadButton")}</span>
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
          multiple
        />
      </div>

      {existingDocuments && existingDocuments.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{t("existingHeading")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingDocuments.map((doc) => {
              const fileName =
                doc.document.split("/").pop() ||
                t("documentFallback", { id: doc.id });
              const isImage = isImageFile(fileName);
              const baseUrl =
                process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
                "http://localhost:5051";
              const previewUrl = `${baseUrl}/${doc.document}`;

              return (
                <div
                  key={doc.id}
                  className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveExistingDocument?.(doc.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    <X size={16} />
                  </button>

                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => viewExistingDocument(doc)}
                  >
                    {isImage ? (
                      <div className="relative w-full h-24 mb-2">
                        <Image
                          src={previewUrl}
                          alt={fileName}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="mb-2">{getFileIcon(fileName)}</div>
                    )}
                    <span className="text-xs font-medium text-center truncate w-full">
                      {fileName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Uploaded Files */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{t("newHeading")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((file, index) => {
              const isImage = isImageFile(file.name);
              const previewUrl = URL.createObjectURL(file);

              return (
                <div
                  key={index}
                  className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveDocument(index);
                      URL.revokeObjectURL(previewUrl);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  >
                    <X size={16} />
                  </button>

                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => viewNewDocument(file)}
                  >
                    {isImage ? (
                      <div className="relative w-full h-24 mb-2">
                        <Image
                          src={previewUrl}
                          alt={file.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="mb-2">{getFileIcon(file.name)}</div>
                    )}
                    <span className="text-xs font-medium text-center truncate w-full">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t("fileSize", {
                        size: (file.size / 1024 / 1024).toFixed(2),
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;

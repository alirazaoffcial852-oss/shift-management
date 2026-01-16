"use client";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { shiftDetailFormProps, ShiftDocument } from "./types/form";
import { CustomerSection } from "./CustomerSection";
import { TrainSection } from "./TrainSection";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { DropZone } from "@/components/FileUpload/DropZone";
import { useTranslations } from "next-intl";
import { FileText, ImageIcon, FileIcon, ExternalLink, X } from "lucide-react";
import { useState, useEffect } from "react";

interface shiftDetails {
  [key: string]: any;
}

export function ShiftDetail({
  shifts,
  onUpdate,
  errors,
  handleBack,
  isSubmitting,
  onContinue,
  files,
  dragActive,
  handleDrag,
  handleDrop,
  handleFileInput,
  removeFile,
  useComponentAs = "ADD",
  handleDocumentRemoval,
}: shiftDetailFormProps) {
  const t = useTranslations("pages.shift");
  const [documentUrls, setDocumentUrls] = useState<Record<number, string>>({});

  const handleChange = (field: keyof shiftDetails, value: any) => {
    const newShifts: shiftDetails = { ...shifts };
    newShifts[field] = value;
    onUpdate(newShifts);
  };

  const handleTrainUpdate = (newTrains: any[]) => {
    handleChange("shiftTrain", newTrains);
  };

  const handleRemoveExistingDocument = (documentId: number) => {
    const updatedDocuments = shifts.documents.filter(
      (doc) => doc.id !== documentId
    );
    handleChange("documents", updatedDocuments);
    if (handleDocumentRemoval) {
      handleDocumentRemoval(documentId);
    }

    const urlToRevoke = documentUrls[documentId];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
      const newUrls = { ...documentUrls };
      delete newUrls[documentId];
      setDocumentUrls(newUrls);
    }
  };

  const viewDocument = (doc: ShiftDocument | File) => {
    let url: string;

    if (doc instanceof File) {
      url = URL.createObjectURL(doc);
    } else {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
        "http://localhost:5051";
      url = `${baseUrl}/${doc.document}`;
    }

    window.open(url, "_blank");
  };

  useEffect(() => {
    return () => {
      Object.values(documentUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [documentUrls]);

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

  return (
    <div className="space-y-8">
      <CustomerSection
        shifts={shifts}
        onUpdate={handleChange}
        errors={errors}
      />
      <div className="space-y-4">
        <div className="flex gap-10 items-center">
          <h3>{t("shiftInformation")}</h3>
          <Switch
            checked={shifts.shiftDetail.has_note}
            onCheckedChange={(checked) =>
              handleChange("shiftDetail", {
                ...shifts.shiftDetail,
                has_note: checked,
              })
            }
          />
        </div>
        {shifts.shiftDetail.has_note && (
          <>
            <Textarea
              onChange={(e) =>
                handleChange("shiftDetail", {
                  ...shifts.shiftDetail,
                  note: e.target.value,
                })
              }
              placeholder={t("shiftNotePlaceholder")}
              value={shifts.shiftDetail.note}
            />
            {errors.note && (
              <p className="text-sm text-red-500">{errors.note}</p>
            )}
          </>
        )}
      </div>
      <TrainSection
        shifts={shifts}
        onUpdate={handleTrainUpdate}
        errors={errors}
      />
      <div className="!mt-[77px]">
        <div className="flex gap-10 items-center">
          <h3>{t("documents")}</h3>
          <Switch
            checked={shifts.shiftDetail?.has_document}
            onCheckedChange={(checked) =>
              handleChange("shiftDetail", {
                ...shifts.shiftDetail,
                has_document: checked,
              })
            }
          />
        </div>
        {shifts.shiftDetail?.has_document && (
          <div className="mt-4">
            <DropZone
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileSelect={handleFileInput}
              multiple={true}
            />
            {shifts.documents && shifts.documents.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {t("existingDocumentsHeading")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shifts.documents.map((doc: ShiftDocument) => {
                    const fileName =
                      doc.document.split("/").pop() || `Document ${doc.id}`;
                    return (
                      <div
                        key={doc.id}
                        className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingDocument(doc.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X size={16} />
                        </button>

                        <div
                          className="flex flex-col items-center cursor-pointer"
                          onClick={() => viewDocument(doc)}
                        >
                          <div className="mb-2">{getFileIcon(fileName)}</div>
                          <span className="text-xs font-medium text-center truncate w-full">
                            {fileName}
                          </span>
                          <div className="flex items-center mt-1 text-xs text-blue-600">
                            <ExternalLink size={12} className="mr-1" />
                            {t("view")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {files && files.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {t("newFilesHeading")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X size={16} />
                      </button>

                      <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => viewDocument(file)}
                      >
                        <div className="mb-2">{getFileIcon(file.name)}</div>
                        <span className="text-xs font-medium text-center truncate w-full">
                          {file.name}
                        </span>
                        <div className="flex items-center mt-1 text-xs text-blue-600">
                          <ExternalLink size={12} className="mr-1" />
                          {t("preview")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`flex mt-10 ${
          useComponentAs === "ADD" ? "justify-between" : "justify-end"
        }`}
      >
        {useComponentAs === "ADD" && (
          <SMSButton
            className="bg-transparent text-[18px] shadow-none p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            {t("backButton")}
          </SMSButton>
        )}
        <SMSButton
          className="bg-black rounded-full"
          onClick={onContinue}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("loadingButton") : t("submitButton")}
        </SMSButton>
      </div>
    </div>
  );
}

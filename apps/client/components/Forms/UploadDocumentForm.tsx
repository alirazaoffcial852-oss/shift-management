"use client";

import React, { useEffect } from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { useCompletionForm } from "@/hooks/locomotiveAction/useCompletedDailogForm";
import { UploadDocumentDropZone } from "../FileUpload/UploadDocumentDropZone";
import { DocumentPreview } from "../FileUpload/DocumentPreview";
import { useLocomotiveActionTable } from "@/hooks/locomotiveAction/useLocomotiveAction";
import { FileText, FileType2, File } from "lucide-react";
import Image from "next/image";
import { IMAGE_URL } from "@/constants/env.constants";
import { useTranslations } from "next-intl";

interface UploadDocumentFormProps {
  id?: number;
  onClose: () => void;
  type: "add" | "edit";
}

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({
  id,
  onClose,
  type,
}) => {
  const [removedDocs, setRemovedDocs] = React.useState<number[]>([]);

  const {
    note,
    setNote,
    errors,
    isLoading,
    files,
    dragActive,
    handleDrag,
    handleFileInputUploadDocument,
    handleDropUploadDocument,
    removeFile,
    handleSubmit,
  } = useCompletionForm(Number(id), onClose, type, removedDocs, setRemovedDocs);

  const { fetchLocomotiveActionData, locomotiveActionData } =
    useLocomotiveActionTable();
  const t = useTranslations("common");
  const tmaintenance = useTranslations("pages.maintenance");

  useEffect(() => {
    if (id && type === "edit") {
      fetchLocomotiveActionData(id);
    }

    setNote("");
  }, [id, type]);

  useEffect(() => {
    if (locomotiveActionData && type === "edit") {
      const latestCompletion =
        locomotiveActionData.completions?.length > 0
          ? [...locomotiveActionData.completions].sort(
              (a, b) =>
                new Date(b.completion_date).getTime() -
                new Date(a.completion_date).getTime()
            )[0]
          : null;

      if (latestCompletion?.note) {
        setNote(latestCompletion.note);
      }
    }
  }, [locomotiveActionData, type]);

  const getFileTypeIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "doc":
      case "docx":
        return <FileType2 className="h-6 w-6 text-blue-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const isImageFile = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
      ext ?? ""
    );
  };

  const getAllDocuments = () => {
    const allDocuments: any[] = [];
    locomotiveActionData?.completions?.forEach((completion) => {
      if (completion.documents && completion.documents.length > 0) {
        completion.documents.forEach((doc: any) => {
          allDocuments.push({
            ...doc,
            completionId: completion.id,
            completionDate: completion.completion_date,
            completionNote: completion.note,
          });
        });
      }
    });
    return allDocuments;
  };

  const allDocuments = getAllDocuments();

  return (
    <div className="w-full">
      {locomotiveActionData && type === "edit" && allDocuments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("existing_documents")}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="lg:col-span-8 col-span-1">
              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                  {allDocuments
                    .filter((doc) => !removedDocs.includes(doc.id))
                    .map((doc, idx) => {
                      const previewUrl = IMAGE_URL + doc.url;
                      const ext = doc.url.split(".").pop()?.toLowerCase() || "";
                      const isImage = isImageFile(doc.url);

                      return (
                        <div key={doc.id} className="relative w-28">
                          <div
                            className="relative h-28 w-full rounded-full overflow-hidden  cursor-pointer border flex items-center justify-center bg-white hover:shadow-md transition-shadow"
                            onClick={() => window.open(previewUrl, "_blank")}
                            title={`Click to view - Uploaded: ${new Date(doc.completionDate).toLocaleDateString()}`}
                          >
                            {isImage ? (
                              <Image
                                src={previewUrl}
                                alt={`Document ${idx + 1}`}
                                width={20}
                                height={20}
                                className="object-cover w-20 h-20"
                              />
                            ) : (
                              getFileTypeIcon(ext)
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRemovedDocs((prev) => [...prev, doc.id]);
                              }}
                              className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-100 z-10"
                            >
                              ×
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                            {doc.completionNote}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              {allDocuments.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {allDocuments.length}{" "}
                  {allDocuments.length > 1 ? t("documents") : t("document")}{" "}
                  {t("uploaded_click_to_view")}
                </p>
              )}
            </div>

            <div className="lg:col-span-4 col-span-1">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                {t("current_notes")}
              </Label>
              <div className="bg-white p-3 rounded border text-sm text-gray-600 max-h-32 overflow-y-auto">
                {locomotiveActionData.completions?.find((c) => c.note)?.note ||
                  t("no_notes_available")}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-8 col-span-1">
            <Label className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1 mb-2 block">
              {type === "edit"
                ? t("upload_additional_documents")
                : t("upload_documents")}
            </Label>
            {files.length > 0 ? (
              <>
                {files.map((file, index) => (
                  <DocumentPreview
                    key={index}
                    file={file}
                    onRemove={() => removeFile(index)}
                  />
                ))}
              </>
            ) : (
              <UploadDocumentDropZone
                dragActive={dragActive}
                onDrag={handleDrag}
                onDrop={handleDropUploadDocument}
                onFileSelect={handleFileInputUploadDocument}
                multiple
              />
            )}
            {errors?.file?.[0] && (
              <p className="text-sm text-red-500 mt-1">{errors.file[0]}</p>
            )}
          </div>

          <div className="lg:col-span-4 col-span-1">
            <Label
              htmlFor="note"
              className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1"
            >
              {type === "edit" ? t("update_notes") : t("note")}
            </Label>
            <Textarea
              name="note"
              className="w-full min-h-[200px] lg:min-h-[300px] px-3 py-2 text-gray-800 border rounded-lg focus:outline-none resize-none"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                type === "edit" ? t("update_your_notes") : t("add_your_notes")
              }
            />
            {errors?.note?.[0] && (
              <p className="text-sm text-red-500 mt-1">{errors.note[0]}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6 md:mt-10 p-2 md:p-4">
          <SMSButton
            className="bg-black rounded-full text-sm md:text-base px-6 py-2 md:px-8 md:py-3"
            type="submit"
            loading={isLoading}
            loadingText={
              id ? t("updating_completion") : t("creating_completion")
            }
            text={type === "add" ? t("buttons.save") : t("buttons.update")}
          />
        </div>
      </form>
    </div>
  );
};

export default UploadDocumentForm;

"use client";

import React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { DropZone } from "@/components/FileUpload/DropZone";
import { ImagePreview } from "@/components/FileUpload/ImagePreview";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { useCompletionForm } from "@/hooks/locomotiveAction/useCompletedDailogForm";
import { useLocomotiveActionTable } from "@/hooks/locomotiveAction/useLocomotiveAction";
import { useTranslations } from "next-intl";

interface CompletionFormProps {
  id?: number;
  onClose: () => void;
  type: "add" | "edit";
}

const CompletedForm: React.FC<CompletionFormProps> = ({
  id,
  onClose,
  type,
}) => {
  const {
    note,
    setNote,
    errors,
    isLoading,
    files,
    dragActive,
    handleFileInput,
    handleDrag,
    handleDrop,
    removeFile,
    handleSubmit,
  } = useCompletionForm(Number(id), onClose);
  const t = useTranslations("common");

  const imageUrl = "";
  const file = files?.[0];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8 col-span-1">
          {file ? (
            <ImagePreview
              file={file}
              imageUrl={imageUrl}
              onRemove={() => removeFile(0)}
              alt="Uploaded Preview"
            />
          ) : (
            <DropZone
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileSelect={handleFileInput}
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
            {t("note")}
          </Label>
          <Textarea
            name="note"
            className="w-full min-h-[200px] lg:min-h-[300px] px-3 py-2 text-gray-800 border rounded-lg focus:outline-none resize-none"
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
          loadingText={id ? t("updating_completion") : t("creating_completion")}
          text={type === "add" ? t("buttons.save") : t("buttons.update")}
        />
      </div>
    </form>
  );
};

export default CompletedForm;

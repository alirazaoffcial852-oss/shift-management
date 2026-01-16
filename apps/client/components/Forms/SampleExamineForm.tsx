"use client";

import React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { DropZone } from "@/components/FileUpload/DropZone";
import { ImagePreview } from "@/components/FileUpload/ImagePreview";
import { useSampleExamineForm } from "@/hooks/sampling/useSampleExamineForm";
import { SampleExamine } from "@/types/Sampling";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { useTranslations } from "next-intl";

interface SampleExamineFormProps {
  id?: number;
  onClose: (Sample: SampleExamine) => void;
  type: "add" | "edit";
}

const SampleExamineForm: React.FC<SampleExamineFormProps> = ({
  id,
  onClose,
  type,
}) => {
  const {
    sampleExamine,
    errors,
    isLoading,
    file,
    imageUrl,
    dragActive,
    handleInputChange,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    removeExistingImage,
    handleSubmit,
  } = useSampleExamineForm(Number(id), onClose);
  const t = useTranslations("common");

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8 col-span-1">
          {file || imageUrl ? (
            <ImagePreview
              file={file}
              imageUrl={imageUrl}
              onRemove={file ? removeFile : removeExistingImage}
              alt={`img`}
            />
          ) : (
            <DropZone
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileSelect={handleFileInput}
            />
          )}
        </div>

        <div className="lg:col-span-4 col-span-1">
          <Label
            htmlFor="note"
            className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1 "
          >
            {t("note")}
          </Label>
          <Textarea
            name="notes"
            className="w-full min-h-[200px] lg:min-h-[300px] px-3 py-2 text-gray-800 border rounded-lg focus:outline-none resize-none"
            value={sampleExamine?.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
          {errors?.notes && errors.notes.length > 0 && (
            <p className="text-sm text-red-500 mt-1">{errors.notes[0]}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6 md:mt-10 p-2 md:p-4">
        <SMSButton
          className="bg-black rounded-full text-sm md:text-base px-6 py-2 md:px-8 md:py-3"
          type="submit"
          loading={isLoading}
          loadingText={
            id ? t("updating_sample_examine") : t("creating_sample_examine")
          }
          text={type !== "add" ? t("buttons.update") : t("buttons.save")}
        />
      </div>
    </form>
  );
};

export default SampleExamineForm;

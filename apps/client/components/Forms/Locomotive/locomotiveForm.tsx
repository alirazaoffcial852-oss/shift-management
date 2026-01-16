"use client";

import React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { LocomotiveFormFields } from "./LocomotiveFormFields";
import { DropZone } from "@/components/FileUpload/DropZone";
import { FileList } from "@/components/FileUpload/FileList";
import { useLocomotiveForm } from "@/hooks/locomotive/useLocomotiveForm";
import { ImagePreview } from "@/components/FileUpload/ImagePreview";
import { FORMMODE } from "@/types/shared/global";
import { useTranslations } from "next-intl";

interface LocomoticeFormProps {
  useComponentAs: FORMMODE;
  id?: string;
}

const LocomotiveForm: React.FC<LocomoticeFormProps> = ({ id }) => {
  const {
    locomotive,
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
  } = useLocomotiveForm(Number(id));

  const t = useTranslations("pages.locomotives");

  return (
    <form onSubmit={handleSubmit}>
      <LocomotiveFormFields
        locomotive={locomotive}
        errors={errors}
        onInputChange={handleInputChange}
      />
      <div>
        <h3 className="text-lg font-medium mt-4">{t("locomotiveImage")}</h3>

        {file || imageUrl ? (
          <ImagePreview
            file={file}
            imageUrl={imageUrl}
            onRemove={file ? removeFile : removeExistingImage}
            alt={`${locomotive.name} preview`}
          />
        ) : (
          <>
            <DropZone
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileSelect={handleFileInput}
              translations={{
                uploadIllustration: t("uploadIllustration"),
                dragAndDropYourFileHere: t("dragAndDropYourFileHere"),
                pleaseUploadPdfJpgOrPngFiles: t("pleaseUploadPdfJpgOrPngFiles"),
                aFileMaximumSizeShouldBe5MB: t("aFileMaximumSizeShouldBe5MB"),
                uploadAFile: t("uploadAFile"),
              }}
            />
          </>
        )}
      </div>
      <div className="flex justify-end mt-6 md:mt-10 p-2 md:p-4">
        <SMSButton
          className="bg-black rounded-full text-sm md:text-base"
          type="submit"
          loading={isLoading}
          loadingText={id ? t("updatingLocomotive") : t("creatingLocomotive")}
          text={id ? t("update") : t("save")}
        />
      </div>
    </form>
  );
};

export default LocomotiveForm;

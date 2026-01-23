import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { getImagePath } from "@/utils/imagePath";

interface DropZoneProps {
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  multiple?: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  translations?: {
    uploadIllustration?: string;
    dragAndDropYourFileHere?: string;
    pleaseUploadPdfJpgOrPngFiles?: string;
    aFileMaximumSizeShouldBe5MB?: string;
    uploadAFile?: string;
  };
}

export const DropZone: React.FC<DropZoneProps> = ({
  dragActive,
  onDrag,
  onDrop,
  onFileSelect,
  multiple = false,
  translations,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadIllustration =
    translations?.uploadIllustration || "upload illustration";
  const dragAndDropText =
    translations?.dragAndDropYourFileHere || "Drag and Drop Your File Here!";
  const fileTypesText =
    translations?.pleaseUploadPdfJpgOrPngFiles ||
    "Please upload PDF, jpg or png files";
  const maxSizeText =
    translations?.aFileMaximumSizeShouldBe5MB ||
    "A file maximum size should be 5 MB";
  const uploadButtonText = translations?.uploadAFile || "UPLOAD A FILE";

  return (
    <div
      className={`p-4 md:p-8 border-2 border-dashed rounded-lg ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4">
          <img
            src={getImagePath("/images/uploadeIcon.jpg")}
            alt={uploadIllustration}
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </div>
        <h3 className="mb-2 text-lg md:text-xl font-medium text-center">
          {dragAndDropText}
        </h3>
        <p className="mb-4 text-xs md:text-sm text-gray-500 text-center">
          {fileTypesText}
        </p>
        <p className="mb-4 text-xs text-gray-400 text-center">{maxSizeText}</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 md:px-6 py-2 bg-black text-white rounded-full flex items-center gap-2 text-sm md:text-base"
        >
          <Upload size={16} />
          {uploadButtonText}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onFileSelect}
          className="hidden"
          multiple={multiple}
        />
      </div>
    </div>
  );
};

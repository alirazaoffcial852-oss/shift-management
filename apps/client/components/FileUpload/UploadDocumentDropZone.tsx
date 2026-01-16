import React, { useRef } from "react";
import { Upload } from "lucide-react";

interface UploadDocumentDropZoneProps {
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  multiple?: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UploadDocumentDropZone: React.FC<UploadDocumentDropZoneProps> = ({
  dragActive,
  onDrag,
  onDrop,
  onFileSelect,
  multiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`p-4 md:p-8 ${
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
            src="/images/uploadeIcon.jpg"
            alt="upload illustration"
            className="w-24 h-24 md:w-32 md:h-32"
          />
        </div>
        <h3 className="mb-2 text-lg md:text-xl font-medium text-center">
          Drag and Drop Your File Here!
        </h3>
        <p className="mb-4 text-xs md:text-sm text-gray-500 text-center">
          Please upload PDF, jpg or png files
        </p>
        <p className="mb-4 text-xs text-gray-400 text-center">
          A file maximum size should be 5 MB
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 md:px-6 py-2 bg-black text-white rounded-full flex items-center gap-2 text-sm md:text-base"
        >
          <Upload size={16} />
          UPLOAD A FILE
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={onFileSelect}
          className="hidden"
          multiple={multiple}
        />
      </div>
    </div>
  );
};

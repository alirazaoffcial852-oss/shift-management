import React from "react";
import { X } from "lucide-react";

interface DocumentPreviewProps {
  file: File;
  imageUrl?: string;
  onRemove: () => void;
  alt?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  imageUrl,
  onRemove,
  alt = "File preview",
}) => {
  const isImage = file.type.startsWith("image/");
  const previewUrl = URL.createObjectURL(file);

  const handleClick = () => {
    window.open(previewUrl, "_blank");
  };

  return (
    <div className="relative mt-4 border rounded-lg p-4">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={handleClick}
      >
        {isImage ? (
          <img
            src={previewUrl}
            alt={alt}
            className="h-20 w-20 object-cover rounded-md"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-md">
            <span className="text-sm font-medium">
              {file.name.split(".").pop()?.toUpperCase()}
            </span>
          </div>
        )}
        <p className="text-gray-700 text-sm">{file.name}</p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
      >
        <X size={18} />
      </button>
    </div>
  );
};

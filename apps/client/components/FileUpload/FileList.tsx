import React from "react";
import { FileText, ImageIcon, FileIcon, ExternalLink, X } from "lucide-react";

interface FileListProps {
  file: File | File[];
  onRemove: (index?: number) => void;
  multiple?: boolean;
  onView?: (file: File, index?: number) => void;
}

export const FileList: React.FC<FileListProps> = ({
  file,
  onRemove,
  onView,
  multiple = false,
}) => {
  // Get file icon based on type
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

  if (!file) return null;

  if (multiple && Array.isArray(file)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {file.map((f, index) => (
          <div
            key={`${f.name}-${index}`}
            className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
          >
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X size={16} />
            </button>

            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onView && onView(f, index)}
            >
              <div className="mb-2">{getFileIcon(f.name)}</div>
              <span className="text-xs font-medium text-center truncate w-full">
                {f.name}
              </span>
              <div className="flex items-center mt-1 text-xs text-blue-600">
                <ExternalLink size={12} className="mr-1" />
                Preview
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const singleFile = file as File;
  return (
    <div className="mt-4">
      <div className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => onRemove()}
          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <X size={16} />
        </button>

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => onView && onView(singleFile)}
        >
          <div className="mb-2">{getFileIcon(singleFile.name)}</div>
          <span className="text-xs font-medium text-center truncate w-full">
            {singleFile.name}
          </span>
          <div className="flex items-center mt-1 text-xs text-blue-600">
            <ExternalLink size={12} className="mr-1" />
            Preview
          </div>
        </div>
      </div>
    </div>
  );
};

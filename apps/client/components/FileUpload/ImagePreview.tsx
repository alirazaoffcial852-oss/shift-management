import { IMAGE_URL } from "@/constants/env.constants";
import React from "react";

interface ImagePreviewProps {
  file?: File;
  imageUrl?: string;
  onRemove: () => void;
  alt?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  imageUrl,
  onRemove,
  alt = "Preview image",
}) => {
  const previewUrl = file
    ? URL.createObjectURL(file)
    : imageUrl?.startsWith("http") || imageUrl?.startsWith("https")
      ? imageUrl
      : `${IMAGE_URL?.replace(/\/$/, "")}/${imageUrl?.replace(/^\//, "")}`;

  if (!imageUrl && !file) return null;

  const handleImageClick = () => {
    // Open the image in a new tab
    window.open(previewUrl, "_blank");
  };

  return (
    <div className="mt-4 relative">
      <div
        className="relative h-64 w-full bg-gray-100 rounded-md overflow-hidden cursor-pointer"
        onClick={handleImageClick}
      >
        <img
          src={previewUrl}
          alt={alt}
          className="h-full w-full object-contain"
        />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the image click
          onRemove();
        }}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
        aria-label="Remove image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

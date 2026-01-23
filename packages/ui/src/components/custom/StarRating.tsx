"use client";

import * as React from "react";

export interface StarRatingProps {
  value: number; // 0..5 (supports halves)
  outOf?: number;
  size?: number; // px
  className?: string;
  onChange?: (rating: number) => void; // Optional: makes it interactive
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  outOf = 5,
  size = 12,
  className = "",
  onChange,
}) => {
  const full = Math.floor(value);
  const hasHalf = value % 1 > 0; // Show half star for any decimal value
  const isInteractive = !!onChange;

  const handleStarClick = (index: number) => {
    if (onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-[2px] ${className}`}
      aria-label={`rating ${value} of ${outOf}`}
    >
      {Array.from({ length: outOf }).map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && hasHalf;

        if (isHalf) {
          // Render half star using overlay technique
          return (
            <span
              key={i}
              className={`relative inline-block text-[#F6C33E] leading-none ${
                isInteractive
                  ? "cursor-pointer hover:opacity-80 transition-opacity"
                  : ""
              }`}
              style={{ fontSize: size }}
              onClick={() => handleStarClick(i)}
            >
              <span className="text-gray-300">★</span>
              <span
                className="absolute left-0 top-0 overflow-hidden text-[#F6C33E]"
                style={{ width: "50%" }}
              >
                ★
              </span>
            </span>
          );
        }

        return (
          <span
            key={i}
            className={`text-[#F6C33E] leading-none ${
              isInteractive
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : ""
            }`}
            style={{ fontSize: size }}
            onClick={() => handleStarClick(i)}
          >
            {isFull ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;

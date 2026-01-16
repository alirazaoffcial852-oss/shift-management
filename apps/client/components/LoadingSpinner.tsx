"use client";
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
  className = "",
  color = "#3E8258",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <Loader2
        className={`${sizeClasses[size]} animate-spin`}
        style={{ color }}
      />
      {text && (
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;

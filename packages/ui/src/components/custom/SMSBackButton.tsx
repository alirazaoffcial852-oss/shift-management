"use client";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { cn } from "@workspace/ui/lib/utils";
import { SMSBackButtonProps } from "@workspace/ui/types/smsBackButton";

export const SMSBackButton: React.FC<SMSBackButtonProps> = ({
  title,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      history.back();
    }
  };

  return (
    <div className="flex items-center gap-5">
      <SMSButton
        size="icon"
        onClick={() => handleClick()}
        variant="secondary"
        className={cn(
          "bg-[#3E8258]/30 hover:bg-[#3E8258]/50 rounded-2xl text-black w-14 h-14",
          className
        )}
      >
        <ArrowLeft style={{ width: "28px", height: "25px" }} />
      </SMSButton>
      {title && (
        <span className="text-2xl font-medium sm:text-3xl md:text-[44px]">
          {title}
        </span>
      )}
    </div>
  );
};

export default SMSBackButton;

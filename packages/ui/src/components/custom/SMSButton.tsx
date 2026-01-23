import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import type { ButtonProps } from "@workspace/ui/components/button";

export interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  text?: string;
  loadingText?: string;
  fullWidth?: boolean;
}

export const SMSButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      startIcon,
      endIcon,
      text,
      loadingText,
      fullWidth,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={cn(
          "relative rounded-full shadow-lg h-[54px] text-[18px]",
          loading && "cursor-not-allowed",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="absolute left-4 h-4 w-4 animate-spin mr-3" />
        )}

        {/* Content Container */}
        <span className={cn("flex items-center gap-2", loading && "pl-4")}>
          {/* Start Icon */}
          {!loading && startIcon && (
            <span className="h-4 w-4">{startIcon}</span>
          )}

          {/* Text Content */}
          <span>{loading ? loadingText || text : text || children}</span>

          {/* End Icon */}
          {!loading && endIcon && <span className="h-4 w-4">{endIcon}</span>}
        </span>
      </Button>
    );
  }
);
SMSButton.displayName = "SMSButton";

"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  bgColor?: string;
  tickColor?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    { className, bgColor = "#3E8258", tickColor = "#FFFFFF", ...props },
    ref
  ) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        `peer h-5 w-5 shrink-0 rounded-sm border-2 border-gray-200 ring-offset-background 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
      disabled:cursor-not-allowed disabled:opacity-50`,
        className
      )}
      style={{
        backgroundColor: props.checked ? bgColor : "transparent",
        borderColor: props.checked ? bgColor : "#D1D5DB",
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center"
        style={{ color: tickColor }}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };

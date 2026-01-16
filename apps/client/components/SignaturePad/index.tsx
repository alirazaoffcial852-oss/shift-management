import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";

interface SignaturePadProps {
  onSave: (signature: string) => Promise<void>;
  disabled?: boolean;
  preventCloseOnLeave?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  disabled,
  preventCloseOnLeave = false,
}) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Add event listeners to prevent mouse events from closing the dialog
  useEffect(() => {
    if (preventCloseOnLeave && containerRef.current) {
      const container = containerRef.current;

      const preventEvent = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
      };

      // Add listeners for all mouse events that might cause problems
      container.addEventListener("mouseleave", preventEvent, true);
      container.addEventListener("mouseout", preventEvent, true);
      container.addEventListener("pointerleave", preventEvent, true);
      container.addEventListener("pointerout", preventEvent, true);

      return () => {
        // Clean up event listeners
        container.removeEventListener("mouseleave", preventEvent, true);
        container.removeEventListener("mouseout", preventEvent, true);
        container.removeEventListener("pointerleave", preventEvent, true);
        container.removeEventListener("pointerout", preventEvent, true);
      };
    }
  }, [preventCloseOnLeave]);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    signatureRef.current?.clear();
    setIsEmpty(true);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (signatureRef.current && !isEmpty && !isSubmitting) {
      try {
        setIsSubmitting(true);
        const signatureData = signatureRef.current.toDataURL();
        await onSave(signatureData);
      } catch (error) {
        console.error("Signature save error:", error);
        setIsSubmitting(false);
      }
    }
  };

  // Capture and prevent any events that might bubble up
  const preventBubbling = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="w-full"
      ref={containerRef}
      onMouseLeave={preventBubbling}
      onMouseOut={preventBubbling}
      onClick={preventBubbling}
    >
      <div
        className="border border-gray-300 rounded-lg overflow-hidden"
        onMouseLeave={preventBubbling}
        onMouseOut={preventBubbling}
      >
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            className: "w-full h-64 bg-white",
            onMouseLeave: preventBubbling,
            onMouseOut: preventBubbling,
          }}
          onBegin={() => setIsEmpty(false)}
        />
      </div>
      <div
        className="mt-4 flex justify-end space-x-4"
        onMouseLeave={preventBubbling}
        onMouseOut={preventBubbling}
      >
        <SMSButton type="button" onClick={handleClear} disabled={isSubmitting}>
          <span className="font-medium flex items-center space-x-3">
            Reset Signature
          </span>
        </SMSButton>
        <SMSButton
          type="button"
          onClick={handleSave}
          disabled={isEmpty || isSubmitting || disabled}
        >
          <span className="font-medium flex items-center space-x-3">
            {isSubmitting ? "Submitting..." : "Submit"}
          </span>
        </SMSButton>
      </div>
    </div>
  );
};

export default SignaturePad;

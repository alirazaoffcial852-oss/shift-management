import React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { BaseFormLayoutProps } from "@/types/clientForm.interface";

export const BaseFormLayout: React.FC<BaseFormLayoutProps> = ({
  children,
  onSubmit,
  isEditMode,
  loading,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {children}
      </div>

      <div className="flex justify-end items-center mt-6 md:mt-10 p-2 md:p-4 gap-4">
        <SMSButton
          className="bg-black w-full sm:w-auto rounded-full text-sm md:text-base px-4 md:px-6 py-2 md:py-3 text-white"
          type="submit"
          loading={loading}
          loadingText={isEditMode ? "Updating Client..." : "Creating Client..."}
          text={isEditMode ? "Update" : "Save"}
        />
      </div>
    </form>
  );
};

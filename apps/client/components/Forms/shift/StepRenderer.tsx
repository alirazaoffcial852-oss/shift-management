import { Product } from "@/types/product";
import React from "react";
import { StepRendererProps } from "./types/form";
import { ShiftInformationForm } from "./ShiftInformation";
import { BasicInformationForm } from "./BasicInformation";
import { ProductDetail } from "./ProductDetail";
import { IniateShift } from "@/types/shift";
import { ShiftDetail } from "./ShiftDetail";

export const StepRenderer: React.FC<StepRendererProps> = ({
  shifts,
  setShifts,
  iniateShift,
  setIniateShift,
  company,
  routes,
  setRoutes,
  currentStep,
  errors,
  handleContinue,
  handleBack,
  handleSubmit,
  isSubmitting,
  products,
  files,
  dragActive,
  handleDrag,
  handleDrop,
  handleFileInput,
  removeFile,
  setCustomizeProduct,
}) => {
  switch (currentStep) {
    case 0:
      return (
        <BasicInformationForm
          iniateShift={iniateShift}
          onUpdate={setIniateShift}
          errors={errors}
          onContinue={handleContinue}
          key={currentStep}
        />
      );
    case 1:
      return (
        <ShiftInformationForm
          shifts={shifts}
          onUpdate={setShifts}
          errors={errors}
          onContinue={handleContinue}
          handleBack={handleBack}
          key={currentStep}
          products={products}
          setCustomizeProduct={setCustomizeProduct}
        />
      );
    case 2:
      return (
        <ProductDetail
          shifts={shifts}
          products={products}
          handleBack={handleBack}
          onContinue={handleContinue}
        />
      );
    case 3:
      return (
        <ShiftDetail
          shifts={shifts}
          onUpdate={setShifts}
          products={products}
          handleBack={handleBack}
          onContinue={handleSubmit}
          isSubmitting={isSubmitting}
          errors={errors}
          files={files || []}
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleFileInput={handleFileInput}
          removeFile={removeFile}
        />
      );

    default:
      return null;
  }
};

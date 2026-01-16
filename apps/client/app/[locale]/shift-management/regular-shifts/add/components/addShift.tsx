"use client";

import { useShiftForm } from "@/hooks/shift/useShiftForm";
import { useTranslations } from "next-intl";
import ShiftTabs from "../../../project-usn-shifts/add/components/shiftTabs";
import { BasicInformationForm } from "@/components/Forms/shift/BasicInformation";
import { ShiftInformationForm } from "@/components/Forms/shift/ShiftInformation";
import { ProductDetail } from "@/components/Forms/shift/ProductDetail";
import { ShiftDetail } from "@/components/Forms/shift/ShiftDetail";
import SMSBackButton from "@workspace/ui/components/custom/SMSBackButton";

const AddShift = () => {
  const t = useTranslations("pages.shift");

  const {
    shifts,
    setShifts,
    iniateShift,
    setIniateShift,
    isSubmitting,
    handleSubmit,
    products,
    files,
    dragActive,
    handleDrag,
    handleDrop,
    currentErrors,
    handleFileInput,
    removeFile,
    setCustomizeProduct,
  } = useShiftForm("ADD");

  const headingText =
    shifts?.status === "OFFER"
      ? t.raw("AddOfferHeading")
      : t.raw("AddShiftHeading");

  return (
    <div className="mt-14 mb-24">
      <div className="px-7 mb-4">
        <ShiftTabs />
      </div>
      <div className="container mx-auto w-full lg:w-[80%] bg-white shadow p-6 sm:p-10 rounded-[30px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4">
            <SMSBackButton />
            <h1
              className="text-2xl font-semibold text-[#1F1F1F]"
              dangerouslySetInnerHTML={{ __html: headingText }}
            />
          </div>
        </div>

        <div className="space-y-14">
          <BasicInformationForm
            iniateShift={iniateShift}
            onUpdate={setIniateShift}
            errors={currentErrors}
            onContinue={() => {}}
            hideFooter
          />

          <ShiftInformationForm
            shifts={shifts}
            onUpdate={setShifts}
            errors={currentErrors}
            onContinue={() => {}}
            handleBack={() => {}}
            products={products}
            useComponentAs="EDIT"
            setCustomizeProduct={setCustomizeProduct}
          />

          <ProductDetail
            shifts={shifts}
            products={products}
            handleBack={() => {}}
            onContinue={() => {}}
            useComponentAs="EDIT"
          />

          <ShiftDetail
            shifts={shifts}
            onUpdate={setShifts}
            products={products}
            handleBack={() => {}}
            onContinue={handleSubmit}
            isSubmitting={isSubmitting}
            errors={currentErrors}
            files={files || []}
            dragActive={dragActive}
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleFileInput={handleFileInput}
            removeFile={removeFile}
            useComponentAs="EDIT"
          />
        </div>
      </div>
    </div>
  );
};

export default AddShift;

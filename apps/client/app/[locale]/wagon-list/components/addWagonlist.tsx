"use client";

import React from "react";
import FormLayoutWagonList from "@workspace/ui/components/custom/FormLayoutWagonList";
import { useWegonList } from "@/constants/product.constants";
import { StepRenderer } from "@/components/Forms/wegon-list/StepRender";
import { useParams } from "next/navigation";
import { useWagonListForm } from "@/hooks/wagonList/useWagonListForm";
import { useTranslations } from "next-intl";

interface AddWagonListProps {
  shiftTrainData?: {
    id: number;
    departure_location: string;
    locomotive_name?: string;
    shift_date?: string;
    shift?: any;
  } | null;
}

const AddWagonList: React.FC<AddWagonListProps> = ({ shiftTrainData }) => {
  const params = useParams();
  const shiftTrainId = params?.id;

  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleCheckboxChange,
    handleRestrictionsChange,
    prevStep,
    currentStep,
    totalSteps,
    preventBubbling,
    nextStep,
    signatureRef,
    isSignatureEmpty,
    setIsSignatureEmpty,
    wagonListData,
    profile,
    existingDocuments,
  } = useWagonListForm(Number(shiftTrainId), shiftTrainData);

  const t = useTranslations("pages.wegonList");

  if (!wagonListData) {
    return (
      <div className="flex items-center justify-center h-full mt-20">
        <div>
          <FormLayoutWagonList
            heading={
              <>
                {t("LetsCreate")} <br /> {t("WagonList")}
              </>
            }
            steps={useWegonList()}
            currentStep={currentStep}
            isDialog={false}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <StepRenderer
                currentStep={currentStep}
                formData={formData}
                errors={errors}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
                handleRestrictionsChange={handleRestrictionsChange}
                signatureRef={signatureRef}
                isSignatureEmpty={isSignatureEmpty}
                setIsSignatureEmpty={setIsSignatureEmpty}
                preventBubbling={preventBubbling}
                profile={profile}
                existingDocuments={existingDocuments}
              />
              <div className="flex justify-between mt-8">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border rounded-md"
                  >
                    {t("Back")}
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-primary text-white rounded-full"
                  disabled={isSubmitting}
                >
                  {currentStep < totalSteps - 1
                    ? t("Continue")
                    : isSubmitting
                      ? wagonListData
                        ? "Updating..."
                        : "Submitting..."
                      : wagonListData
                        ? "Update"
                        : "Submit"}
                </button>
              </div>
            </form>
          </FormLayoutWagonList>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full mt-20">
      <div>
        <FormLayoutWagonList
          heading={<>{t("EditWagonList")}</>}
          steps={useWegonList()}
          currentStep={currentStep}
          isDialog={false}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <StepRenderer
              currentStep={currentStep}
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              handleCheckboxChange={handleCheckboxChange}
              handleRestrictionsChange={handleRestrictionsChange}
              signatureRef={signatureRef}
              isSignatureEmpty={isSignatureEmpty}
              setIsSignatureEmpty={setIsSignatureEmpty}
              preventBubbling={preventBubbling}
              profile={profile}
              existingDocuments={existingDocuments}
            />
            <div className="flex justify-between mt-8">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 border rounded-md"
                >
                  {t("Back")}
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary text-white rounded-full"
                disabled={isSubmitting}
              >
                {currentStep < totalSteps - 1
                  ? t("Continue")
                  : isSubmitting
                    ? wagonListData
                      ? "Updating..."
                      : "Submitting..."
                    : wagonListData
                      ? "Update"
                      : "Submit"}
              </button>
            </div>
          </form>
        </FormLayoutWagonList>
      </div>
    </div>
  );
};

export default AddWagonList;

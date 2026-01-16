import { StepRendererProps } from "@/types/employee";
import { EmployeeForm } from "./InformationForm";
import { PricingForm } from "./PricingForm";

export const StepRenderer = ({
  currentStep,
  employees,
  setEmployees,
  company,
  errors,
  handleContinue,
  handleBack,
  handleSubmit,
  loading,
  isEditMode,
  onclose,
  isDialog,
}: StepRendererProps) => {
  return (
    <>
      {currentStep === 0 ? (
        <EmployeeForm
          employee={employees}
          company={company}
          onUpdate={setEmployees}
          errors={errors}
          onContinue={handleContinue}
          isEditMode={isEditMode}
          onclose={onclose}
          isDialog={isDialog}
        />
      ) : (
        <PricingForm
          employee={employees}
          onUpdate={setEmployees}
          errors={errors}
          onSubmit={handleSubmit}
          handleBack={handleBack}
          isSubmitting={loading}
          onclose={onclose}
          isDialog={isDialog}
        />
      )}
    </>
  );
};

"use client";
import { useEmployeeForm } from "@/hooks/employee/useEmployeeForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { StepRenderer } from "@/components/Forms/Employee/StepRenderer";
import { useSteps } from "@/constants/employee.constants";
import { useTranslations } from "next-intl";

const EditEmployee = ({ id }: { id: string }) => {
  const {
    employee,
    setEmployee,
    company,
    errors,
    currentStep,
    loading,
    handleContinue,
    handleBack,
    handleSubmit,
  } = useEmployeeForm(Number(id));
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {tsidebar("employee")}
        </>
      }
      steps={useSteps()}
      currentStep={currentStep}
    >
      {employee && (
        <StepRenderer
          employees={employee}
          setEmployees={setEmployee}
          company={company}
          errors={errors}
          currentStep={currentStep}
          loading={loading}
          handleContinue={handleContinue}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          isEditMode={true}
        />
      )}
    </FormLayout>
  );
};

export default EditEmployee;

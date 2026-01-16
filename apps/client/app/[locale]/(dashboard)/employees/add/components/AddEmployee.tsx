"use client";
import { useEmployeeForm } from "@/hooks/employee/useEmployeeForm";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { StepRenderer } from "@/components/Forms/Employee/StepRenderer";
import { useSteps } from "@/constants/employee.constants";
import { useTranslations } from "next-intl";

interface AddEmployeeProps {
  onclose?: () => void;
  isDialog?: boolean;
}

const AddEmployee = ({ onclose, isDialog = false }: AddEmployeeProps) => {
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
  } = useEmployeeForm(undefined, isDialog);
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success && isDialog && onclose) {
      onclose();
    }
  };

  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_create")} <br /> {tsidebar("employee")}
        </>
      }
      steps={useSteps()}
      currentStep={currentStep}
      isDialog={isDialog}
    >
      <StepRenderer
        employees={employee}
        setEmployees={setEmployee}
        company={company}
        errors={errors}
        currentStep={currentStep}
        loading={loading}
        handleContinue={handleContinue}
        handleBack={handleBack}
        handleSubmit={handleFormSubmit}
        onclose={onclose}
        isDialog={isDialog}
      />
    </FormLayout>
  );
};

export default AddEmployee;

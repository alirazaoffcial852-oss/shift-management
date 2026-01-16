import { RolePermissionsForm } from "@/components/Forms/Configuration/RolePermissionsForm";
import { CompanyForm } from "@/components/Forms/Configuration/ComapnyForm";
import { StepRendererProps } from "@/types/configuration";

export const StepRenderer = ({
  roles,
  currentStep,
  formState,
  errors,
  updateRolesAndPermissions,
  updateCompanies,
  handleContinue,
  handleBack,
  handleSubmit,
  permissions,
}: StepRendererProps) => {
  if (currentStep === 0) {
    return (
      <RolePermissionsForm
        roles={formState.rolesAndPermissions}
        onUpdate={updateRolesAndPermissions}
        errors={errors}
        onContinue={handleContinue}
        permissions={permissions}
        key={currentStep}
      />
    );
  } else if (currentStep === 1) {
    return (
      <CompanyForm companies={formState.companies} onUpdate={updateCompanies} errors={errors} onSubmit={handleSubmit} handleBack={handleBack} roles={roles} key={currentStep} />
    );
  }
};

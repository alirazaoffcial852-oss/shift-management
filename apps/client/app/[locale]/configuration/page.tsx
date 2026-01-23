"use client";
import { useConfigurationForm } from "@/hooks/useConfigurationForm";
import ConfigurationLayout from "@/components/Layout/Configuration";
import { StepRenderer } from "@/components/Forms/Configuration/StepRenderer";
import { CONFIGURATION_STEPS } from "@/constants/configuration.constants";

const Configuration = () => {
  const {
    formState,
    roles,
    errors,
    updateRolesAndPermissions,
    updateCompanies,
    handleRole,
    handleBack,
    handleAddCompanies,
    permissions,
  } = useConfigurationForm();
  

  return (
    <ConfigurationLayout
      steps={CONFIGURATION_STEPS}
      currentStep={formState.currentStep}
    >
      <StepRenderer
        currentStep={formState.currentStep}
        formState={formState}
        errors={errors}
        updateRolesAndPermissions={updateRolesAndPermissions}
        updateCompanies={updateCompanies}
        handleContinue={handleRole}
        handleBack={handleBack}
        handleSubmit={handleAddCompanies}
        permissions={permissions}
        roles={roles}
      />
    </ConfigurationLayout>
  );
};

export default Configuration;

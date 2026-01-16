"use client";
import React from "react";
import { useClientForm } from "@/hooks/useClientForm";
import { EditFormProps } from "@workspace/ui/types/formLayout";
import { BasicInformationSection } from "./BasicInformation";
import { ConfigurationNumbersSection } from "./ConfigurationNumbersSection";
import { SubscriptionPaymentSection } from "./SubscriptionAndPayment";
import { DatabaseConfigurationSection } from "./DatabaseConfigurationSection";
import { BaseFormLayout } from "@/components/layouts/BaseFormLayout";
import { LanguageSection } from "./LanguageSection";
import { CountryCitySection } from "./CountryCitySection";

export const ClientForm: React.FC<EditFormProps> = ({ useComponentAs, id }) => {
  const { client, errors, loading, handleInputChange, handleSubmit } =
    useClientForm(id ? Number(id) : undefined);

  const isEditMode = useComponentAs === "EDIT";

  return (
    <BaseFormLayout
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      loading={loading}
    >
      <BasicInformationSection
        data={client}
        errors={errors}
        isEditMode={isEditMode}
        handleInputChange={handleInputChange}
      />

      <ConfigurationNumbersSection
        client={client}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      <SubscriptionPaymentSection
        client={client}
        errors={errors}
        isEditMode={isEditMode}
        handleInputChange={handleInputChange}
      />

      <LanguageSection
        data={client}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      <CountryCitySection
        locationData={client?.location}
        data={client}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      {isEditMode && (
        <DatabaseConfigurationSection
          client={client}
          errors={errors}
          handleInputChange={handleInputChange}
        />
      )}
    </BaseFormLayout>
  );
};

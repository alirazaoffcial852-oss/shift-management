import { Product } from "@/types/product";
import React from "react";
import { PriceForm } from "./PriceForm";
import BasicInformationForm from "./BasicInformationForm";
import { TotalCostForm } from "./TotalCostForm";
import { PersonnelSelectionForm } from "./PersonnelForm";
import { StepRendererProps } from "./components/productForm";
import SelectedPersonnelDetailsForm from "./SelectedPersonnelDetailsForm";

export const StepRenderer: React.FC<StepRendererProps> = ({
  product,
  setProduct,
  company,
  customers,
  routes,
  setRoutes,
  currentStep,
  errors,
  handleContinue,
  handleBack,
  handleSubmit,
  isSubmitting,
  pagination,
  isLoadingCustomers,
  handleLoadMoreCustomers,
  handleSearchCustomers,
  fetchCustomers,
  productCustomization = false,
}) => {
  switch (currentStep) {
    case 0:
      return (
        <BasicInformationForm
          product={product}
          onUpdate={(product: Product) => setProduct(product)}
          errors={errors}
          onContinue={handleContinue}
          fetchCustomers={fetchCustomers}
          customers={customers}
          routes={routes}
          setRoutes={setRoutes}
          pagination={pagination}
          isLoadingCustomers={isLoadingCustomers}
          handleLoadMoreCustomers={handleLoadMoreCustomers}
          handleSearchCustomers={handleSearchCustomers}
          productCustomization={productCustomization}
        />
      );
    case 1:
      return (
        <PriceForm
          product={product}
          onUpdate={(product: Product) => setProduct(product)}
          errors={errors}
          onContinue={handleContinue}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
          routes={routes}
          setRoutes={setRoutes}
        />
      );
    case 2:
      return (
        <TotalCostForm
          product={product}
          onUpdate={(product: Product) => setProduct(product)}
          errors={errors}
          onContinue={handleContinue}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
        />
      );
    case 3:
      return (
        <PersonnelSelectionForm
          product={product}
          company={company}
          onUpdate={(product: Product) => setProduct(product)}
          errors={errors}
          onContinue={handleContinue}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
        />
      );
    case 4:
      return (
        <SelectedPersonnelDetailsForm
          product={product}
          onUpdate={(product: Product) => setProduct(product)}
          errors={errors}
          company={company}
          onSubmit={handleSubmit}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
          customers={customers}
          fetchCustomers={fetchCustomers}
          pagination={pagination}
          isLoadingCustomers={isLoadingCustomers}
          handleLoadMoreCustomers={handleLoadMoreCustomers}
          handleSearchCustomers={handleSearchCustomers}
        />
      );
    default:
      return null;
  }
};

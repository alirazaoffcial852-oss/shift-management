import { Product } from "@/types/product";
import React from "react";
import { PriceForm } from "./PriceForm";
import BasicInformationForm from "./BasicInformationForm";
import { TotalCostForm } from "./TotalCostForm";
import { CustomizeStepRendererProps, StepRendererProps } from "./components/productForm";
import SelectedPersonnelDetailsForm from "./SelectedPersonnelDetailsForm";
import { PersonnelSelectionForm } from "./PersonnelForm";
import { ProductOptionsForm } from "./ProductOptionsForm"; // New component we'll create

export const CustomizeProductStepRenderer: React.FC<CustomizeStepRendererProps> = ({
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
  selectedOption,
  setSelectedOption,
}) => {
  switch (currentStep) {
    case 0:
      return <ProductOptionsForm selectedOption={selectedOption} setSelectedOption={setSelectedOption} onContinue={handleContinue} errors={errors} />;
    case 1:
      return (
        <BasicInformationForm
          product={product}
          onUpdate={(product: Product) => setProduct(product)}
          errors={errors}
          onContinue={handleContinue}
          handleBack={handleBack}
          fetchCustomers={fetchCustomers}
          customers={customers}
          routes={routes}
          setRoutes={setRoutes}
          pagination={pagination}
          isLoadingCustomers={isLoadingCustomers}
          handleLoadMoreCustomers={handleLoadMoreCustomers}
          handleSearchCustomers={handleSearchCustomers}
          productCustomization={selectedOption === "customize"}
        />
      );
    case 2:
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
    case 3:
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
    case 4:
      return selectedOption !== "customize" ? (
        <PersonnelSelectionForm
          product={product}
          company={company}
          onUpdate={(product: Product) => setProduct(product)}
          errors={errors}
          onContinue={handleContinue}
          handleBack={handleBack}
          isSubmitting={isSubmitting}
        />
      ) : (
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
    case 5:
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

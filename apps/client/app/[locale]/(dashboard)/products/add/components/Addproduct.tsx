"use client";
import { StepRenderer } from "@/components/Forms/product/StepRenderer";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useProductForm } from "@/hooks/product/useProductForm";

import { Company } from "@/types/configuration";
import { useTranslations } from "next-intl";
import { useSteps } from "@/constants/product.constants";
import ProductTabs from "./ProductTabs";

const AddProduct = ({ onclose, isDialog = false }: { onclose?: () => void; isDialog?: boolean }) => {
  const {
    product,
    setProduct,
    company,
    customers,
    errors,
    isSubmitting,
    handleContinue,
    handleBack,
    handleSubmit,
    currentStep,
    routes,
    setRoutes,
    pagination,
    isLoadingCustomers,
    handleLoadMoreCustomers,
    handleSearchCustomers,
    fetchCustomers,
  } = useProductForm();
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");

  return (
    <>
      <div>
        <ProductTabs />
      </div>
      <FormLayout
        heading={
          <>
            {tcommon("lets_create")} <br /> {tsidebar("product")}
          </>
        }
        steps={useSteps()}
        currentStep={currentStep}
        isDialog={isDialog}
      >
        <StepRenderer
          customers={customers}
          product={product}
          currentStep={currentStep}
          setProduct={setProduct}
          company={company || ({} as Company)}
          errors={errors}
          handleContinue={handleContinue}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          routes={routes}
          fetchCustomers={fetchCustomers}
          setRoutes={setRoutes}
          pagination={pagination}
          isLoadingCustomers={isLoadingCustomers}
          handleLoadMoreCustomers={handleLoadMoreCustomers}
          handleSearchCustomers={handleSearchCustomers}
        />
      </FormLayout>
    </>
  );
};

export default AddProduct;

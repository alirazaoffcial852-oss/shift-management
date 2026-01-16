"use client";
import { StepRenderer } from "@/components/Forms/product/StepRenderer";
import FormLayout from "@workspace/ui/components/custom/FormLayout";
import { useProductForm } from "@/hooks/product/useProductForm";
import { useSteps } from "@/constants/product.constants";
import { Company } from "@/types/configuration";
import { useTranslations } from "next-intl";

const EditProduct = ({ id }: { id: string }) => {
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
  } = useProductForm(Number(id));
  const tcommon = useTranslations("common");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <FormLayout
      heading={
        <>
          {tcommon("lets_edit")} <br /> {tsidebar("product")}
        </>
      }
      steps={useSteps()}
      currentStep={currentStep}
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
        setRoutes={setRoutes}
        pagination={pagination}
        isLoadingCustomers={isLoadingCustomers}
        handleLoadMoreCustomers={handleLoadMoreCustomers}
        handleSearchCustomers={handleSearchCustomers}
      />
    </FormLayout>
  );
};

export default EditProduct;

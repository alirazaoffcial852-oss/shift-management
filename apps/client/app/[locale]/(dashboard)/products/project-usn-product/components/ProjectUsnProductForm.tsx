"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import SupplierPlantTable from "./SupplierPlantTable";
import { useOrderForm } from "@/hooks/order/userOrderForm";
import { useProductForm } from "@/hooks/product/useProductForm";
import { useTranslations } from "next-intl";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { useProjectUsnProduct } from "@/hooks/projectUsnProduct/useProjectUsnProduct";

interface ProjectUsnProductFormProps {
  productId?: string;
}

const ProjectUsnProductForm: React.FC<ProjectUsnProductFormProps> = ({
  productId,
}) => {
  const router = useRouter();
  const tProduct = useTranslations("pages.products");
  const { supplierOptions } = useOrderForm();
  const {
    allCustomers,
    pagination: customerPagination,
    isLoadingCustomers,
    isLoadingMoreCustomers,
    handleLoadMoreCustomers,
    handleSearchCustomers,
  } = useProductForm();

  const {
    selectedProductName,
    setSelectedProductName,
    selectedCustomer,
    setSelectedCustomer,
    columns,
    setColumns,
    rolesOptions,
    isRoleSelected,
    handleRoleChange,
    handleSubmit,
    isSubmitting,
    isLoading,
  } = useProjectUsnProduct(productId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          {productId ? tProduct("editProduct") : tProduct("addProduct")}
        </h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SMSCombobox
            label={tProduct("supplierPlant")}
            placeholder={tProduct("select")}
            searchPlaceholder={tProduct("search")}
            value={selectedProductName}
            onValueChange={setSelectedProductName}
            options={supplierOptions}
            required
          />
          <SMSCombobox
            label={tProduct("customer")}
            placeholder={tProduct("select")}
            searchPlaceholder={tProduct("search")}
            value={selectedCustomer}
            onValueChange={setSelectedCustomer}
            options={allCustomers
              .filter((c: any) => c.is_for_project_usn_only)
              .map((c: any) => ({
                value: c.id?.toString() || "",
                label: c.name,
              }))}
            required
            hasMore={customerPagination.page < customerPagination.total_pages}
            loadingMore={isLoadingMoreCustomers}
            onLoadMore={handleLoadMoreCustomers}
            onSearch={handleSearchCustomers}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md px-10 py-6 mt-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">
            {tProduct("select_personal_roles")}
          </h3>
          {rolesOptions.map((role: any) => (
            <div key={role.value} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role.value}`}
                checked={isRoleSelected(role.value)}
                onCheckedChange={() => handleRoleChange(role.value)}
                className="border-2 border-gray-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label
                htmlFor={`role-${role.value}`}
                className="text-[18px] font-medium ml-1 capitalize"
              >
                {role.label}
              </Label>
            </div>
          ))}
        </div>

        <SupplierPlantTable columns={columns} setColumns={setColumns} />

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <SMSButton
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? tProduct("saving")
              : productId
                ? tProduct("update")
                : tProduct("add")}
          </SMSButton>
        </div>
      </div>
    </div>
  );
};

export default ProjectUsnProductForm;

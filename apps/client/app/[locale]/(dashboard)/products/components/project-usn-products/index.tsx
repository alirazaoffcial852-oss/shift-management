"use client";
import React from "react";
import {
  getProjectUsnProductActions,
  ProjectUsnProductActionCallbacks,
  useProjectUsnProductColumns,
} from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import ProductTabs from "@/components/Tabs/ProductTabs";
import { PRODUCT_OPTIONS } from "@/constants/tabsOption.constant";
import ProductMatrixDialog from "../../project-usn-product/components/ProductMatrixDialog";
import { useProjectUsnProduct } from "@/hooks/projectUsnProduct/useProjectUsnProduct";
import { useTranslations } from "next-intl";

const ViewProjectUsnProduct = () => {
  const router = useRouter();
  const t = useTranslations("pages.products");

  const {
    productTabValue,
    products,
    currentPage,
    setCurrentPage,
    totalPages,
    isTableLoading,
    isMatrixDialogOpen,
    setIsMatrixDialogOpen,
    selectedProduct,
    handleDelete,
    handleStatusUpdate,
    handleViewMatrix,
    handleSearch,
    handleProductTabChange,
  } = useProjectUsnProduct();

  const actionCallbacks: ProjectUsnProductActionCallbacks = {
    onDelete: handleDelete,
    onStatusUpdate: handleStatusUpdate,
    onViewMatrix: handleViewMatrix,
  };

  const columns = useProjectUsnProductColumns();
  const actions = getProjectUsnProductActions(actionCallbacks);

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center">
        <h2>{t("projectUsnProducts")}</h2>
        <SMSButton
          text={t("addProduct")}
          startIcon={<Plus className="h-4 w-4" />}
          className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
          onClick={() => router.push("/products/project-usn-product/add")}
        />
      </div>

      <ProductTabs
        options={[...PRODUCT_OPTIONS.tabs]}
        value={productTabValue}
        onChange={handleProductTabChange}
      />

      <SMSTable
        columns={columns}
        data={products}
        actions={actions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearchChange={handleSearch}
        isLoading={isTableLoading}
        actionsHeader={t("actions")}
      />

      {selectedProduct && (
        <ProductMatrixDialog
          open={isMatrixDialogOpen}
          onOpenChange={setIsMatrixDialogOpen}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ViewProjectUsnProduct;

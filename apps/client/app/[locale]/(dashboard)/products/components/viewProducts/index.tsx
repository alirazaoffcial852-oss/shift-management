"use client";
import React, { useState } from "react";
import {
  getActions,
  ProductActionCallbacks,
  usePrductColumns,
} from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { PRODUCT_OPTIONS } from "@/constants/tabsOption.constant";
import { Product } from "@/types/product";
import { useProductTable } from "@/hooks/product/useProductTable";
import { useTranslations } from "next-intl";
import ProductTabs, { PRODUCT_TAB_STATUS } from "@/components/Tabs/ProductTabs";
import { usePermission } from "@/hooks/usePermission";

const ViewProduct = () => {
  const router = useRouter();
  const {
    products,
    currentPage,
    totalPages,
    setCurrentPage,
    updateProductStatus,
    duplicateProduct,
    handleSearch,
    removeProduct,
    tabValue,
    setTabValue,
    isLoading,
  } = useProductTable();

  // Custom state for product tabs
  const [productTabValue, setProductTabValue] =
    useState<PRODUCT_TAB_STATUS>("ACTIVE");

  const handleDuplicate = async (product: Product) => {
    await duplicateProduct(product);
  };

  const actionCallbacks: ProductActionCallbacks = {
    onDelete: removeProduct,
    onDuplicate: handleDuplicate,
    onStatusUpdate: updateProductStatus,
  };
  const columns = usePrductColumns();
  const { hasPermission } = usePermission();

  const actions = getActions(actionCallbacks).filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("product.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("product.delete");
    }
    return true;
  });

  const taction = useTranslations("actions");
  const tProduct = useTranslations("pages.products");
  const tsidebar = useTranslations("components.sidebar");

  const handleProductTabChange = (value: PRODUCT_TAB_STATUS) => {
    setProductTabValue(value);
    if (value === "ACTIVE" || value === "ARCHIVED") {
      setTabValue(value);
    }
  };

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center ">
        <h2>{tsidebar("products")}</h2>
        {hasPermission("product.create") && (
          <SMSButton
            text={taction("add") + " " + tsidebar("product")}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/products/add")}
          />
        )}
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
        isLoading={isLoading}
        actionsHeader={tProduct("actions")}
      />
    </div>
  );
};

export default ViewProduct;

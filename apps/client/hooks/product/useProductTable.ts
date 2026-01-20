"use client";
import { useState, useCallback, useEffect } from "react";
import { useCompany } from "@/providers/appProvider";
import ProductService from "@/services/product";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { STATUS } from "@/types/shared/global";

export const useProductTable = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (page = 1, searchTermParam = "") => {
      setIsLoading(true);
      setError(null);
      try {
        if (!company?.id) {
          return;
        }

        const response = await ProductService.getAllProduct(
          page,
          pagination.limit,
          company.id as number,
          tabValue,
          searchTermParam
        );

        const newProducts = response.data?.data || [];

        // Always replace products for standard pagination
        setProducts(newProducts);

        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            total_pages: response.data.pagination.total_pages,
          });
        }

        return response;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to fetch products";
        setError(errorMsg);
        console.error("Error fetching products:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [company, pagination.limit, tabValue]
  );

  useEffect(() => {
    fetchProducts(pagination.page, searchTerm);
  }, [pagination.page, searchTerm, fetchProducts]);

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, pagination.total_pages]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleTabChange = useCallback((val: STATUS) => {
    setTabValue(val);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const updateProductStatus = useCallback((productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  }, []);

  const duplicateProduct = useCallback(async (product: Product) => {
    try {
      if (product.id !== undefined) {
        const response = await ProductService.duplicateProduct(product.id);
        setProducts((prevProducts) => [response.data, ...prevProducts]);
        toast.success(
          response.message || "Duplicate product created successfully"
        );
      } else {
        toast.error("Product ID is undefined");
      }
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        toast.error((error as any).data.message);
      } else {
        if (error instanceof Error) {
          toast.error(error.message || "An error occurred");
        } else {
          toast.error("An error occurred");
        }
      }
    }
  }, []);

  const formattedProducts = products.map((product: any, index: number) => ({
    id: (pagination.page - 1) * pagination.limit + index + 1,
    productName: product.name,
    ...product,
  }));

  return {
    tabValue,
    setTabValue: handleTabChange,
    handleSearch,
    setProducts,
    products: formattedProducts,
    rawProducts: products,
    updateProductStatus,
    isLoading,
    error,
    pagination,
    handleLoadMore,
    removeProduct,
    refetch: () => fetchProducts(pagination.page, searchTerm),
    duplicateProduct,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    fetchProducts,
  };
};


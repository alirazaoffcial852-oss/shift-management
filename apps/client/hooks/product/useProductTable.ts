"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useCompany } from "@/providers/appProvider";
import ProductService from "@/services/product";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { STATUS } from "@/types/shared/global";

export const useProductTable = (initialPage = 1, limit = 20) => {
  const { company } = useCompany();
  const [tabValue, setTabValue] = useState<STATUS>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastDebouncedSearchRef = useRef<string>("");
  const lastPageRef = useRef<number>(1);
  const lastTabValueRef = useRef<STATUS>(tabValue);

  const fetchProducts = useCallback(
    async (page = 1, searchTermParam = "", append = false) => {
      const isLoadMore = append && page > 1;
      
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
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

        if (append && page > 1) {
          setProducts((prev) => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }

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
        if (isLoadMore) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [company, pagination.limit, tabValue]
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (lastDebouncedSearchRef.current !== searchTerm) {
        setPagination((prev) => ({ ...prev, page: 1 }));
        setProducts([]); 
        lastDebouncedSearchRef.current = searchTerm;
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (lastTabValueRef.current !== tabValue) {
      lastTabValueRef.current = tabValue;
      setPagination((prev) => ({ ...prev, page: 1 }));
      setProducts([]);
      lastDebouncedSearchRef.current = "";
      lastPageRef.current = 1;
    }
  }, [tabValue]);

  useEffect(() => {
    const isSearchChange = lastDebouncedSearchRef.current !== debouncedSearchTerm;
    const isPageIncrement = pagination.page > lastPageRef.current;
    
    const shouldAppend = isPageIncrement && !isSearchChange && pagination.page > 1;
    
    if (isSearchChange) {
      lastDebouncedSearchRef.current = debouncedSearchTerm;
    }
    lastPageRef.current = pagination.page;
    
    fetchProducts(pagination.page, debouncedSearchTerm, shouldAppend);
  }, [pagination.page, debouncedSearchTerm, fetchProducts, tabValue]);

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages && !isLoadingMore) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.page, pagination.total_pages, isLoadingMore]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleTabChange = useCallback((val: STATUS) => {
    setTabValue(val);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setProducts([]);
    lastDebouncedSearchRef.current = ""; 
    lastPageRef.current = 1; 
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
    id: index + 1,
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
    isLoadingMore,
    error,
    pagination,
    handleLoadMore,
    removeProduct,
    refetch: () => fetchProducts(pagination.page, searchTerm, false),
    duplicateProduct,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    setCurrentPage: (page: number) =>
      setPagination((prev) => ({ ...prev, page })),
    fetchProducts,
  };
};


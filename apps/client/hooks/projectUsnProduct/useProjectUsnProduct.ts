"use client";
import { useState, useMemo, useEffect } from "react";
import { SupplierPlantColumn } from "@/types/project-usn-product";
import { ProjectUsnProduct } from "@/types/project-usn-product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProjectUsnProductService from "@/services/projectUsnProduct";
import { PRODUCT_TAB_STATUS } from "@/components/Tabs/ProductTabs";
import { useCompany } from "@/providers/appProvider";

export const useProjectUsnProduct = (productId?: string) => {
  const router = useRouter();

  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [productTabValue, setProductTabValue] =
    useState<PRODUCT_TAB_STATUS>("USN_PRODUCT");
  const [products, setProducts] = useState<ProjectUsnProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMatrixDialogOpen, setIsMatrixDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProjectUsnProduct | null>(null);

  const [columns, setColumns] = useState<SupplierPlantColumn[]>([
    {
      id: "supplier-1",
      label: "Supplier Plant",
      tonnage: "",
      rows: [{ id: "row-1", distance: "", costPerTon: "" }],
    },
    {
      id: "supplier-2",
      label: "Supplier Plant",
      tonnage: "",
      rows: [{ id: "row-1", distance: "", costPerTon: "" }],
    },
  ]);

  const { company } = useCompany();

  const companyLocalStorage =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("selected-company") || "null")
      : null;

  const selectedCompany = company || companyLocalStorage;

  const rolesOptions = useMemo(
    () =>
      selectedCompany?.roles
        ?.filter((role: { act_as: string }) => role.act_as !== "STAFF")
        .map(
          (role: { name: string; company_role_id?: number; id?: number }) => ({
            label: role.name,
            value: role?.company_role_id
              ? role?.company_role_id.toString()
              : role?.id?.toString() || "",
          })
        ) || [],
    [selectedCompany]
  );

  const fetchProducts = async (p0?: number, searchQuery?: string) => {
    setIsTableLoading(true);
    try {
      const response = await ProjectUsnProductService.getProjectUsnProducts({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        status: productTabValue === "ARCHIVED" ? "ARCHIVED" : "ACTIVE",
      });

      setProducts(response.data.data);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error: any) {
      console.log(error, "error");
      toast.error(error?.data?.message || "Failed to fetch products");
    } finally {
      setIsTableLoading(false);
    }
  };

  const fetchProductData = async (id: string) => {
    setIsLoading(true);
    try {
      const response =
        await ProjectUsnProductService.getProjectUsnProductById(id);
      const product = response.data;

      setSelectedProductName(product.supplier_id.toString());
      setSelectedCustomer(product.customer_id.toString());

      setSelectedRoles(
        product.product_usn_personnel_roles?.map((roleObj: any) =>
          roleObj.company_personnel_id.toString()
        ) || []
      );

      const transformedColumns = product.supplier_plants.map(
        (plant: any, index: number) => ({
          id: `supplier-${index + 1}`,
          label: "Supplier Plant",
          tonnage: plant.tons.toString(),
          rows: plant.distances.map((dist: any, distIndex: number) => ({
            id: `row-${distIndex + 1}`,
            distance: dist.distance_km.toString(),
            costPerTon: dist.cost_per_ton.toString(),
          })),
        })
      );

      setColumns(transformedColumns);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ProjectUsnProductService.deleteProjectUsnProduct(id.toString());
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  const handleStatusUpdate = async (
    id: number,
    status: "ACTIVE" | "ARCHIVED"
  ) => {
    try {
      await ProjectUsnProductService.updateStatus(id.toString(), status);
      toast.success(`Product ${status.toLowerCase()} successfully`);
      fetchProducts();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleViewMatrix = (product: ProjectUsnProduct) => {
    setSelectedProduct(product);
    setIsMatrixDialogOpen(true);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleProductTabChange = (value: PRODUCT_TAB_STATUS) => {
    setProductTabValue(value);
    setCurrentPage(1);

    if (value === "ACTIVE" || value === "ARCHIVED") {
      router.push("/products");
    }
  };

  const isRoleSelected = (roleValue: string) =>
    selectedRoles.includes(roleValue);

  const handleRoleChange = (roleValue: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleValue)
        ? prev.filter((v) => v !== roleValue)
        : [...prev, roleValue]
    );
  };

  const validateForm = () => {
    if (!selectedProductName) {
      toast.error("Please select a supplier plant");
      return false;
    }

    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return false;
    }

    if (selectedRoles.length === 0) {
      toast.error("Please select at least one personnel role");
      return false;
    }

    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const column = columns[colIndex];
      if (!column?.tonnage || column.tonnage === "") {
        toast.error("Please enter tonnage for all supplier plants");
        return false;
      }
      const tonnageValue = parseFloat(column.tonnage);
      if (isNaN(tonnageValue) || tonnageValue <= 0) {
        toast.error(
          "Please enter a valid tonnage value (must be a positive number)"
        );
        return false;
      }
    }

    if (
      columns.length > 0 &&
      Array.isArray(columns[0]?.rows) &&
      columns[0]?.rows.length > 0
    ) {
      for (
        let rowIndex = 0;
        rowIndex < (columns[0]?.rows?.length ?? 0);
        rowIndex++
      ) {
        const row = columns[0]?.rows?.[rowIndex];
        if (!row?.distance || row?.distance === "") {
          toast.error(`Please enter distance for Row ${rowIndex + 1}`);
          return false;
        }
        const distanceValue = parseFloat(row?.distance || "");
        if (isNaN(distanceValue) || distanceValue < 0) {
          toast.error(
            `Please enter a valid distance value for Row ${rowIndex + 1} (must be a non-negative number)`
          );
          return false;
        }
      }
    }

    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const column = columns[colIndex];
      if (!column || !Array.isArray(column.rows)) {
        continue;
      }
      for (let rowIndex = 0; rowIndex < column.rows.length; rowIndex++) {
        const row = column.rows[rowIndex];
        if (!row?.costPerTon || row.costPerTon === "") {
          toast.error(
            `Please enter cost per ton for Row ${rowIndex + 1} in all supplier plants`
          );
          return false;
        }
        const costValue = parseFloat(row?.costPerTon || "");
        if (isNaN(costValue) || costValue < 0) {
          toast.error(
            `Please enter a valid cost per ton value for Row ${rowIndex + 1} (must be a non-negative number)`
          );
          return false;
        }
      }
    }

    return true;
  };

  const transformToApiPayload = () => {
    return {
      supplier_id: parseInt(selectedProductName),
      customer_id: parseInt(selectedCustomer),
      company_id: selectedCompany?.id,
      personnel_role_ids: selectedRoles.map((id) => parseInt(id)),
      supplier_plants: columns.map((column) => ({
        tons: parseFloat(column.tonnage),
        distances: column.rows.map((row) => ({
          distance_km: parseFloat(row.distance),
          cost_per_ton: parseFloat(row.costPerTon),
        })),
      })),
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = transformToApiPayload();

      if (productId) {
        await ProjectUsnProductService.updateProjectUsnProduct(
          productId,
          payload
        );
        toast.success("Project USN Product updated successfully");
      } else {
        await ProjectUsnProductService.createProjectUsnProduct(payload);
        toast.success("Project USN Product created successfully");
      }

      router.push("/products/project-usn-product");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, productTabValue]);

  return {
    selectedProductName,
    setSelectedProductName,
    selectedCustomer,
    setSelectedCustomer,
    selectedRoles,
    isRoleSelected,
    handleRoleChange,
    columns,
    setColumns,
    rolesOptions,
    handleSubmit,
    isSubmitting,
    isLoading,

    productTabValue,
    setProductTabValue,
    products,
    currentPage,
    setCurrentPage,
    totalPages,
    isTableLoading,
    searchTerm,
    isMatrixDialogOpen,
    setIsMatrixDialogOpen,
    selectedProduct,
    setSelectedProduct,
    handleDelete,
    handleStatusUpdate,
    handleViewMatrix,
    handleSearch,
    handleProductTabChange,
    fetchProducts,
  };
};

"use client";
import { BasicDetailFormProps } from "./types/form";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useBvProjectTable } from "@/hooks/bvProject/useBvProjectTable";
import { useCompany } from "@/providers/appProvider";
import { Switch } from "@workspace/ui/components/switch";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import MapWithSearch from "@/components/Map";
import { Shift, shiftDetail } from "@/types/shift";
import { useCostCenterTable } from "@/hooks/costCenter/useCostCenterTable";
import { useTypeOfOperationTable } from "@/hooks/typeOfOperation/useTypeOfOperationTable";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useBvProjectForm } from "@/hooks/bvProject/useBvProjectForm";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { AddProjectDialog } from "@/components/Dialog/AddProjectDialog";
import { useProjectForm } from "@/hooks/project/useProjectForm";
import { AddCustomerDialog } from "@/components/Dialog/AddCustomerDialog";
import { AddBvProjectDialog } from "@/components/Dialog/AddBvProject";
import { AddProductDialog } from "@/components/Dialog/AddProduct";
import { useProductTable } from "@/hooks/product/useProductTable";
import { AddCostCenterDialog } from "@/components/Dialog/AddCostCenter";
import { AddTypeOfOperationDialog } from "@/components/Dialog/AddTypeOfOperation";
import { TypeOfOperation } from "@/types/typeOfOperation";
import { useTranslations } from "next-intl";

export function BasicDetail({
  shifts,
  onUpdate,
  errors,
  setCustomizeProduct,
}: BasicDetailFormProps) {
  const t = useTranslations("pages.shift");
  const { company } = useCompany();
  const {
    projects,
    handleLoadMoreProjects,
    handleSearchProjects,
    isLoadingProjects,
    pagination,
    fetchProject,
  } = useBvProjectForm();

  const {
    customers,
    handleLoadMoreCustomers,
    handleSearchCustomers,
    fetchCustomers,
    isLoadingCustomers,
    pagination: customerPagination,
  } = useProjectForm();

  const {
    products,
    isLoading: isLoadingProducts,
    isLoadingMore: isLoadingMoreProducts,
    handleLoadMore,
    totalPages,
    handleSearch: fetchProductsWithSearch,
  } = useProductTable();

  const [productsPagination, setProductsPagination] = useState({
    page: 1,
    total_pages: 0,
  });
  const [addBvProjectDialog, setAddBvProjectDialog] = useState(false);
  const [addCostCenterDialog, setAddCostCenterDialog] = useState(false);
  const [typeOfOperationDialog, setTypeOfOperationDialog] = useState(false);

  const { locomotives } = useLocomotiveTable();
  const {
    bvProjects,
    isLoading: isLoadingBvProjects,
    totalPages: bvProjectTotalPages,
    fetchBvProjectsWithSearch,
    refetch,
  } = useBvProjectTable();

  const [bvProjectsPagination, setBvProjectsPagination] = useState({
    page: 1,
    total_pages: 0,
  });
  const loadMoreTriggeredRef = useRef(false);
  const lastProjectIdRef = useRef<string | undefined>(shifts.project_id);

  useEffect(() => {
    if (lastProjectIdRef.current !== shifts.project_id) {
      lastProjectIdRef.current = shifts.project_id;
      setBvProjectsPagination({ page: 1, total_pages: 0 });
      loadMoreTriggeredRef.current = false;
    }
  }, [shifts.project_id]);

  const handleSearchBvProjects = useCallback(
    (searchTerm: string) => {
      setBvProjectsPagination((prev) => ({ ...prev, page: 1 }));
      loadMoreTriggeredRef.current = false;
      fetchBvProjectsWithSearch(
        1,
        searchTerm,
        shifts.project_id ? parseInt(shifts.project_id) : undefined
      );
    },
    [fetchBvProjectsWithSearch, shifts.project_id]
  );

  const handleLoadMoreBvProjects = useCallback(() => {
    if (loadMoreTriggeredRef.current || isLoadingBvProjects) {
      return;
    }

    if (
      bvProjectsPagination.page === 1 &&
      bvProjectsPagination.page < bvProjectTotalPages &&
      bvProjects.length > 0
    ) {
      loadMoreTriggeredRef.current = true;
      const nextPage = bvProjectsPagination.page + 1;
      setBvProjectsPagination((prev) => ({ ...prev, page: nextPage }));
      fetchBvProjectsWithSearch(
        nextPage,
        "",
        shifts.project_id ? parseInt(shifts.project_id) : undefined
      ).finally(() => {
        setTimeout(() => {
          loadMoreTriggeredRef.current = false;
        }, 1000);
      });
    }
  }, [
    bvProjectsPagination.page,
    bvProjectTotalPages,
    fetchBvProjectsWithSearch,
    shifts.project_id,
    isLoadingBvProjects,
    bvProjects.length,
  ]);

  const {
    costCenters,
    isLoading: isLoadingCostCenters,
    pagination: costCenterPagination,
    handleLoadMore: handleLoadMoreCostCenters,
    handleSearch: handleSearchCostCenters,
    refetch: fetchCostCenters,
  } = useCostCenterTable();
  const {
    typeOfOperations,
    isLoading: isLoadingTypeOperations,
    pagination: typeOperationPagination,
    handleLoadMore: handleLoadMoreTypeOperations,
    handleSearch: handleSearchTypeOperations,
    refetch: fetchTypeOfOperations,
  } = useTypeOfOperationTable();
  const [addProjectDialog, setAddProjectDialog] = useState(false);
  const [addCustomerDialog, setAddCustomerDialog] = useState(false);
  const [productDialog, setProductDialog] = useState(false);

  const handleChange = (
    field: keyof Shift,
    value: string | string[] | boolean | shiftDetail
  ) => {
    const newShifts = { ...shifts };
    if (newShifts) {
      (newShifts[field] as typeof value) = value;
    }
    onUpdate(newShifts);

    if (field === "project_id") {
      newShifts.bv_project_id = "";
      setBvProjectsPagination({ page: 1, total_pages: 0 });
      loadMoreTriggeredRef.current = false;

      if (company?.id !== undefined) {
        fetchBvProjectsWithSearch(
          1,
          "",
          typeof value === "string" ? parseInt(value) : undefined
        );
      }
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers?.find(
      (customer) => customer.id?.toString() === customerId.toString()
    );
    if (selectedCustomer) {
      const updatedShifts = {
        ...shifts,
        customer_id: customerId,
        phone_no: selectedCustomer.phone,
        product_id: "",
        project_id: "",
        bv_project_id: "",
        shiftDetail: {
          ...shifts.shiftDetail,
          contact_person_name: selectedCustomer.contact_person_name,
          contact_person_phone: selectedCustomer.contact_person_phone,
          has_contact_person: true,
        },
      };
      onUpdate(updatedShifts);
    }
  };

  const customersWithSelected = useMemo(() => {
    const list = customers || [];
    const currentId = shifts.customer_id?.toString();

    if (!currentId || !shifts.customer) {
      return list;
    }

    const alreadyExists = list.some(
      (customer: any) => customer.id?.toString() === currentId
    );

    if (alreadyExists) {
      return list;
    }

    return [shifts.customer, ...list];
  }, [customers, shifts.customer, shifts.customer_id]);

  const selectedCustomer = useMemo(() => {
    const found = customersWithSelected?.find(
      (customer: any) => customer.id?.toString() === shifts.customer_id?.toString()
    );
    return found || (shifts.customer_id && shifts.customer ? shifts.customer : undefined);
  }, [customersWithSelected, shifts.customer_id, shifts.customer]);

  const customerProducts = selectedCustomer?.products || [];
  const customerProjects = selectedCustomer?.projects || [];

  const projectsWithSelected = useMemo(() => {
    const list = shifts.customer_id
      ? customerProjects.filter((project: any) => project.status === "ACTIVE")
      : projects || [];
    const currentId = shifts.project_id?.toString();

    if (!currentId || !shifts.project) {
      return list;
    }

    const alreadyExists = list.some(
      (project: any) => project.id?.toString() === currentId
    );

    if (alreadyExists) {
      return list;
    }

    return [shifts.project, ...list];
  }, [shifts.customer_id, customerProjects, projects, shifts.project_id, shifts.project]);

  const productsWithSelected = useMemo(() => {
    const list = shifts.customer_id
      ? customerProducts.filter((product: any) => product.show_in_dropdown)
      : products || [];
    const currentId = shifts.product_id?.toString();

    if (!currentId || !shifts.product) {
      return list;
    }

    const alreadyExists = list.some(
      (product: any) => product.id?.toString() === currentId
    );

    if (alreadyExists) {
      return list;
    }

    return [shifts.product, ...list];
  }, [shifts.customer_id, customerProducts, products, shifts.product_id, shifts.product]);

  const bvProjectsWithSelected = useMemo(() => {
    const list = bvProjects || [];
    const currentId = shifts.bv_project_id?.toString();

    if (!currentId || !shifts.bv_project) {
      return list;
    }

    const alreadyExists = list.some(
      (bvProject: any) => bvProject.id?.toString() === currentId
    );

    if (alreadyExists) {
      return list;
    }

    return [shifts.bv_project, ...list];
  }, [bvProjects, shifts.bv_project_id, shifts.bv_project]);

  const filteredProducts = productsWithSelected;
  const filteredProjects = projectsWithSelected;


  let hasLocomotive = company?.configuration?.has_locomotive;

  return (
    <div className="space-y-3">
      <h3>{t("basicDetails")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="space-y-2">
          <SMSCombobox
            label={t("customers")}
            placeholder={t("selectCustomer")}
            searchPlaceholder={t("searchCustomers")}
            value={shifts.customer_id?.toString() || ""}
            onValueChange={handleCustomerSelect}
            options={customersWithSelected.map((customer: any) => ({
              value: customer.id?.toString() || "",
              label: customer.name,
            }))}
            required
            error={errors.customer_id}
            addNew={{
              text: t("addCustomer"),
              onClick: () => setAddCustomerDialog(true),
            }}
            hasMore={customerPagination.page < customerPagination.total_pages}
            loadingMore={isLoadingCustomers}
            onLoadMore={handleLoadMoreCustomers}
            onSearch={handleSearchCustomers}
          />
        </div>

        <div className="space-y-2">
          <SMSCombobox
            label={t("project")}
            placeholder={t("selectProject")}
            searchPlaceholder={t("searchProjects")}
            value={shifts.project_id?.toString() || ""}
            onValueChange={(value) => handleChange("project_id", value)}
            options={filteredProjects.map((project: any) => ({
              value: project.id?.toString() || "",
              label: project.name,
            }))}
            // required
            // error={errors.project_id}
            addNew={{
              text: t("addProject"),
              onClick: () => setAddProjectDialog(true),
            }}
            hasMore={pagination.page < pagination.total_pages}
            loadingMore={isLoadingProjects}
            onLoadMore={handleLoadMoreProjects}
            onSearch={handleSearchProjects}
          />
        </div>

        <div className="space-y-2">
          <SMSCombobox
            label={t("bvProject")}
            placeholder={t("selectBvProject")}
            searchPlaceholder={t("searchBvProjects")}
            value={shifts.bv_project_id}
            onValueChange={(value) => handleChange("bv_project_id", value)}
            options={bvProjectsWithSelected.map((bvProject: any) => ({
              value: bvProject.id?.toString() || "",
              label: bvProject.name,
            }))}
            addNew={{
              text: t("addBvProject"),
              onClick: () => setAddBvProjectDialog(true),
            }}
            // required
            // error={errors.bv_project_id}
            hasMore={
              bvProjectsPagination.page < bvProjectTotalPages &&
              bvProjects.length > 0
            }
            loadingMore={isLoadingBvProjects}
            onLoadMore={handleLoadMoreBvProjects}
            onSearch={handleSearchBvProjects}
          />
        </div>
        <div>
          <MapWithSearch
            label={t("location")}
            placeholder={t("enterLocation")}
            value={shifts.location}
            onChange={(e) => handleChange("location", e.target.value)}
            error={errors.location}
            required
          />
        </div>
        <div className="space-y-2">
          <SMSCombobox
            label={t("typeOfOperation")}
            placeholder={t("selectTypeOfOperation")}
            searchPlaceholder={t("searchOperations")}
            value={shifts.shiftDetail?.type_of_operation_id?.toString() || ""}
            onValueChange={(value) =>
              handleChange("shiftDetail", {
                ...shifts.shiftDetail,
                type_of_operation_id: value,
              })
            }
            options={typeOfOperations.map((operation: TypeOfOperation) => ({
              value: operation.id?.toString() || "",
              label: operation.name,
            }))}
            // required
            // error={errors.type_of_operation}
            addNew={{
              text: t("addTypeOfOperation"),
              onClick: () => setTypeOfOperationDialog(true),
            }}
            hasMore={
              typeOperationPagination.page < typeOperationPagination.total_pages
            }
            loadingMore={isLoadingTypeOperations}
            onLoadMore={handleLoadMoreTypeOperations}
            onSearch={handleSearchTypeOperations}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33]">
              {t("product")}
            </Label>
            {shifts.product_id && (
              <span
                className="bg-[#019800] text-white text-[8px] px-2 py-1 rounded-md font-medium cursor-pointer hover:bg-[#017800] transition-colors flex items-center"
                onClick={() => setProductDialog(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                {t("customize")}
              </span>
            )}
          </div>

          <SMSCombobox
            label=""
            placeholder={t("selectProduct")}
            searchPlaceholder={t("searchProducts")}
            value={shifts.product_id}
            onValueChange={(value) => handleChange("product_id", value)}
            options={filteredProducts.map((product: any) => ({
              value: product.id?.toString() || "",
              label: product.name,
            }))}
            required
            error={errors.product_id}
            addNew={{
              text: t("addProduct"),
              onClick: () => setProductDialog(true),
            }}
            hasMore={
              shifts.customer_id ? false : productsPagination.page < totalPages
            }
            loadingMore={shifts.customer_id ? false : isLoadingMoreProducts}
            onLoadMore={shifts.customer_id ? undefined : handleLoadMore}
            onSearch={shifts.customer_id ? undefined : fetchProductsWithSearch}
          />
          {errors.product_id && (
            <p className="text-sm text-red-500">{errors.product_id}</p>
          )}
        </div>
        <div className="space-y-2">
          <SMSCombobox
            label={t("costCenter")}
            placeholder={t("selectCostCenter")}
            searchPlaceholder={t("searchCostCenters")}
            value={shifts.shiftDetail?.cost_center_id?.toString() || ""}
            onValueChange={(value) =>
              handleChange("shiftDetail", {
                ...shifts.shiftDetail,
                cost_center_id: value,
              })
            }
            options={costCenters.map((costCenter) => ({
              value: costCenter.id?.toString() || "",
              label: costCenter.name,
            }))}
            // required
            // error={errors.cost_center}
            addNew={{
              text: t("addCostCenter"),
              onClick: () => setAddCostCenterDialog(true),
            }}
            hasMore={
              costCenterPagination.page < costCenterPagination.total_pages
            }
            loadingMore={isLoadingCostCenters}
            onLoadMore={handleLoadMoreCostCenters}
            onSearch={handleSearchCostCenters}
          />
        </div>
      </div>
      {hasLocomotive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-4 mb-4 min-w-max">
              <Label className=" text-[22px] sm:text-[22px] font-semibold text-[#2D2E33] capitalize pl-2">
                {t("locomotive")}
              </Label>
              <Switch
                checked={shifts.shiftDetail?.has_locomotive}
                onCheckedChange={(checked) =>
                  handleChange("shiftDetail", {
                    ...shifts.shiftDetail,
                    has_locomotive: checked,
                  })
                }
              />
              <p className="text-[10px] font-semibold">{t("showDetails")}</p>
            </div>

            {shifts.shiftDetail?.has_locomotive && (
              <Select
                value={shifts.locomotive_id}
                onValueChange={(value) => handleChange("locomotive_id", value)}
              >
                <SelectTrigger className="h-[54px] w-full rounded-[16px]">
                  <SelectValue placeholder={t("selectLocomotive")} />
                </SelectTrigger>
                <SelectContent>
                  {locomotives?.map((locomotive) => (
                    <SelectItem
                      key={locomotive.id}
                      value={String(locomotive.id) || ""}
                    >
                      {locomotive.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.locomotive_id && (
              <p className="text-sm text-red-500">{errors.locomotive_id}</p>
            )}
          </div>
        </div>
      )}
      <AddProjectDialog
        open={addProjectDialog}
        onClose={() => {
          fetchCustomers && fetchCustomers();
          fetchProject && fetchProject();
          setAddProjectDialog(false);
        }}
      />

      <AddBvProjectDialog
        open={addBvProjectDialog}
        onClose={() => {
          setBvProjectsPagination((prev) => ({ ...prev, page: 1 }));
          if (company?.id !== undefined) {
            fetchBvProjectsWithSearch(
              1,
              "",
              shifts.project_id ? parseInt(shifts.project_id) : undefined
            );
          }

          setAddBvProjectDialog(false);
        }}
      />

      <AddCustomerDialog
        open={addCustomerDialog}
        onClose={() => {
          fetchCustomers && fetchCustomers();
          setAddCustomerDialog(false);
        }}
      />
      <AddCostCenterDialog
        open={addCostCenterDialog}
        onClose={() => {
          setAddCostCenterDialog(false);
          fetchCostCenters && fetchCostCenters();
        }}
      />
      <AddTypeOfOperationDialog
        open={typeOfOperationDialog}
        onClose={() => {
          setTypeOfOperationDialog(false);
          fetchTypeOfOperations && fetchTypeOfOperations();
        }}
      />
      <AddProductDialog
        open={productDialog}
        onClose={() => {
          setProductDialog(false);
          fetchProductsWithSearch("");
          fetchCustomers && fetchCustomers();
        }}
        setCustomizeProduct={setCustomizeProduct}
        id={shifts.product_id}
      />
    </div>
  );
}

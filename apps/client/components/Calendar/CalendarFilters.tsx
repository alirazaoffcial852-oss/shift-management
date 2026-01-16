import { useState } from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useCustomerTable } from "@/hooks/customer/useCustomerTable";
import { useProjectTable } from "@/hooks/project/useProjectTable";
import { useBvProjectForm } from "@/hooks/bvProject/useBvProjectForm";
import { useProductTable } from "@/hooks/product/useProductTable";
import { useEmployeeTable } from "@/hooks/employee/useEmployeeTable";
import { Card } from "@workspace/ui/components/card";
import MapWithSearch from "../Map";
import { SHIFT_STATUS_OPTIONS } from "@/constants/shift.constants";
import { STATUS } from "@/types/shift";
import { useCompany } from "@/providers/appProvider";
import { useTranslations } from "next-intl";

interface CalendarFiltersProps {
  onApplyFilters: (filters: CalendarFilterState) => void;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

export interface CalendarFilterState {
  status: STATUS[] | null;
  employee_id: string[] | null;
  project_id: string[] | null;
  product_id: string[] | null;
  bv_project_id: string[] | null;
  customer_id: string[] | null;
  personnel_id: string[] | null;
  location: string | null;
}

const initialFilters: CalendarFilterState = {
  status: null,
  employee_id: null,
  project_id: null,
  product_id: null,
  bv_project_id: null,
  customer_id: null,
  personnel_id: null,
  location: null,
};

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  onApplyFilters,
  isOpen,
  setIsOpen,
}) => {
  const [filters, setFilters] = useState<CalendarFilterState>(initialFilters);
  const t = useTranslations("components.sidebar");
  const { company } = useCompany();

  const {
    customers,
    handleSearch: handleSearchCustomers,
    handleLoadMoreCustomers,
    isLoading: isLoadingCustomers,
    pagination: customerPagination,
  } = useCustomerTable();
  const {
    products,
    handleSearch: handleSearchProducts,
    handleLoadMore: handleLoadMoreProducts,
    isLoading: isLoadingProducts,
    pagination: productPagination,
  } = useProductTable();
  const {
    projects,
    handleSearchProjects,
    handleLoadMoreProjects,
    isLoading: isLoadingProjects,
    pagination: projectPagination,
  } = useProjectTable();
  const {
    projects: bvProjects,
    handleSearchProjects: handleSearchBvProjects,
    handleLoadMoreProjects: handleLoadMoreBvProjects,
    isLoadingProjects: isLoadingBvProjects,
    pagination: bvProjectPagination,
  } = useBvProjectForm();
  const { employees, handleSearch, handleLoadMore, isLoading, pagination } =
    useEmployeeTable();

  const handleChange = (
    field: keyof CalendarFilterState,
    value: string | null
  ) => {
    if (field === "location") {
      setFilters((prev) => ({ ...prev, [field]: value }));
      return;
    }

    setFilters((prev) => {
      if (value === null) {
        return { ...prev, [field]: null };
      }

      const currentValues = prev[field] || [];
      const valuesArray = Array.isArray(currentValues) ? currentValues : [];

      const valueExists = valuesArray.includes(value);

      if (valueExists) {
        return {
          ...prev,
          [field]: valuesArray.filter((val) => val !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...valuesArray, value],
        };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onApplyFilters(initialFilters);
  };

  return (
    <div className="w-full">
      {isOpen && (
        <Card className="mt-4 p-6 bg-white shadow-2xl rounded-[32px]">
          <h3 className="text-lg font-semibold mb-4">{t("filterShifts")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("status")}</label>
              <SMSCombobox
                options={SHIFT_STATUS_OPTIONS}
                value={filters.status || []}
                onValueChange={(value) => handleChange("status", value)}
                placeholder={t("select_status")}
                multiple={true}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("employee")}</label>
              <SMSCombobox
                options={
                  employees?.map((employee) => ({
                    value: employee.id?.toString() || "",
                    label: employee.name || "",
                  })) || []
                }
                value={filters.employee_id || []}
                onValueChange={(value) => handleChange("employee_id", value)}
                placeholder={t("select_employee")}
                onSearch={handleSearch}
                onLoadMore={handleLoadMore}
                loading={isLoading}
                hasMore={pagination?.page < pagination?.total_pages}
                multiple={true}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("customer")}</label>
              <SMSCombobox
                options={
                  customers?.map((customer) => ({
                    value: customer.id?.toString() || "",
                    label: customer.name || "",
                  })) || []
                }
                value={filters.customer_id || []}
                onValueChange={(value) => handleChange("customer_id", value)}
                placeholder={t("select_customer")}
                onSearch={handleSearchCustomers}
                onLoadMore={handleLoadMoreCustomers}
                loading={isLoadingCustomers}
                hasMore={
                  customerPagination?.page < customerPagination?.total_pages
                }
                multiple={true}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("project")}</label>
              <SMSCombobox
                options={
                  projects?.map((project) => ({
                    value: project.id?.toString() || "",
                    label: project.name || "",
                  })) || []
                }
                value={filters.project_id || []}
                multiple={true}
                onValueChange={(value) => handleChange("project_id", value)}
                placeholder={t("select_project")}
                onSearch={handleSearchProjects}
                onLoadMore={handleLoadMoreProjects}
                loading={isLoadingProjects}
                hasMore={
                  projectPagination?.page < projectPagination?.total_pages
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("bvProject")}</label>
              <SMSCombobox
                options={
                  bvProjects?.map((project) => ({
                    value: project.id?.toString() || "",
                    label: project.name || "",
                  })) || []
                }
                value={filters.bv_project_id || []}
                multiple={true}
                onValueChange={(value) => handleChange("bv_project_id", value)}
                placeholder={t("select_bv_project")}
                onSearch={handleSearchBvProjects}
                onLoadMore={handleLoadMoreBvProjects}
                loading={isLoadingBvProjects}
                hasMore={
                  bvProjectPagination?.page < bvProjectPagination?.total_pages
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("product")}</label>
              <SMSCombobox
                options={
                  products?.map((product) => ({
                    value: product.id?.toString() || "",
                    label: product.name || "",
                  })) || []
                }
                value={filters.product_id || []}
                multiple={true}
                onValueChange={(value) => handleChange("product_id", value)}
                placeholder={t("select_product")}
                onSearch={handleSearchProducts}
                onLoadMore={handleLoadMoreProducts}
                loading={isLoadingProducts}
                hasMore={
                  productPagination?.page < productPagination?.total_pages
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("shift_personnel")}
              </label>
              <SMSCombobox
                options={
                  company?.roles
                    ?.filter((role) => role.act_as === "EMPLOYEE")
                    ?.map((personnel) => ({
                      value: personnel.id?.toString() || "",
                      label: personnel.name || "",
                    })) || []
                }
                value={filters.personnel_id || []}
                multiple={true}
                onValueChange={(value) => handleChange("personnel_id", value)}
                placeholder={t("shift_personnel")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("location")}</label>
              <MapWithSearch
                label=""
                placeholder={t("enter_location")}
                value={filters.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <SMSButton
              onClick={handleReset}
              variant="outline"
              text={t("reset")}
            />
            <SMSButton onClick={handleApply} text={t("applyFilters")} />
          </div>
        </Card>
      )}
    </div>
  );
};

"use client";
import type React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";
import { useProjectForm } from "@/hooks/project/useProjectForm";
import { useBvProjectForm } from "@/hooks/bvProject/useBvProjectForm";
import { useBvProjectTable } from "@/hooks/bvProject/useBvProjectTable";
import { useProductTable } from "@/hooks/product/useProductTable";
import { useReceiveRequestForm } from "@/hooks/receiveRequest/useReceiveRequestHook";
import { useState } from "react";
import { FileCheck } from "lucide-react";
import RequestService from "@/services/request";
import { toast } from "sonner";

interface ReceiveRequestFormProps {
  id?: number;
  onclose: () => void;
  isDialog?: boolean;
  requestData?: any;
  onSuccess?: () => void;
}

const ReceiveRequestForm: React.FC<ReceiveRequestFormProps> = ({
  id,
  onclose,
  isDialog = false,
  onSuccess,
}) => {
  const {
    formData,
    errors,
    handleInputChange,
    employeePagination,
    employees,
    rolesPagination,
    fetchEmployees,
    fetchRoles,
    isLoadingEmployees,
    isLoadingRoles,
  } = useReceiveRequestForm(Number(id), onclose);

  const t = useTranslations("pages.shift");
  const tRequest = useTranslations("pages.request");
  const tactions = useTranslations("actions");
  const tsidebar = useTranslations("components.sidebar");
  const tlabels = useTranslations("common.labels");
  const tcommon = useTranslations("common");

  const {
    products,
    isLoading: isLoadingProducts,
    handleLoadMore,
    totalPages,
    handleSearch: fetchProductsWithSearch,
  } = useProductTable();

  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [formLoading, setFormLoading] = useState(false);

  const handleProductSelect = (value: string) => {
    handleInputChange("product_id", value);
  };

  const handleEmployeeSelect = (value: string) => {
    const employeeId = Number(value);
    if (employeeId && !selectedEmployees.includes(employeeId)) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
    }
  };

  const handleRemoveEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
  };

  const validateForm = () => {
    const validationErrors: string[] = [];

    // if (!formData.product_id) validationErrors.push("Product is required");
    if (!formData.role_id) validationErrors.push(tcommon("role_required"));
    if (selectedEmployees.length === 0)
      validationErrors.push(tcommon("at_least_one_employee_required"));

    return validationErrors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join("\n"));
      return;
    }

    setFormLoading(true);

    try {
      const submissionData = {
        product_id: Number(formData.product_id),
        role_id: Number(formData.role_id),
        company_request_employee_detail_personnels: selectedEmployees.map(
          (employeeId) => ({
            employee_id: employeeId,
          })
        ),
      };

      if (id) {
        await RequestService.approveRequest(id, submissionData);
        if (onSuccess) {
          onSuccess();
        }

        onclose();
      } else {
        toast.error("No request ID provided");
      }
    } catch (error: any) {
      toast.error(error.data.message);
    } finally {
      setFormLoading(false);
    }
  };

  const selectedProduct = products.find(
    (p) => p.id === Number(formData.product_id)
  );

  const rolesOptions =
    selectedProduct?.productPersonnelPricings
      ?.map((pricing: any) => {
        const role = pricing.personnel?.role;
        if (!role) return null;
        return {
          label: role.name,
          value: role.id.toString(),
        };
      })
      .filter(Boolean) ?? [];

  const handlerListOfEmployees = (roleId: number | string) => {
    return employees.filter(
      (employee) => employee.role?.id?.toString() === roleId.toString()
    );
  };

  return (
    <div className={`${isDialog ? "flex flex-col h-full" : ""}`}>
      <form
        onSubmit={handleFormSubmit}
        className={`${isDialog ? "flex flex-col h-full" : "space-y-6"}`}
      >
        <div
          className={`${isDialog ? "flex-1 overflow-y-auto space-y-6 pr-2 pb-4" : "space-y-6"}`}
        >
          <div className="p-2 sm:p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <SMSCombobox
                label={t("Product")}
                placeholder={t("selectProduct")}
                searchPlaceholder={t("searchProducts")}
                value={formData.product_id?.toString() || ""}
                onValueChange={handleProductSelect}
                options={products.map((product: any) => ({
                  value: product.id?.toString() || "",
                  label: product.name,
                }))}
                required
                error={errors.product_id}
                hasMore={totalPages > 1}
                loadingMore={isLoadingProducts}
                onLoadMore={handleLoadMore}
                onSearch={fetchProductsWithSearch}
              />

              <SMSCombobox
                label={tlabels("role")}
                placeholder={tlabels("SelectRole")}
                searchPlaceholder={tlabels("SearchRole")}
                value={formData.role_id?.toString() || ""}
                onValueChange={(value) =>
                  handleInputChange("role_id", Number(value) || "")
                }
                options={rolesOptions}
                required
                error={errors.role_id}
                hasMore={rolesPagination.page < rolesPagination.total_pages}
                loadingMore={isLoadingRoles}
                onLoadMore={() => fetchRoles(rolesPagination.page + 1)}
                onSearch={(term) => fetchRoles(1, term)}
              />

              <SMSCombobox
                label={tsidebar("employee")}
                placeholder={tsidebar("select_employee")}
                searchPlaceholder={tsidebar("search_employee")}
                value=""
                onValueChange={handleEmployeeSelect}
                options={handlerListOfEmployees(formData.role_id || 0)
                  .filter(
                    (employee: any) =>
                      !selectedEmployees.includes(employee?.id || 0)
                  )
                  .map((employee: any) => ({
                    value: employee.id?.toString() || "",
                    label: employee.name,
                  }))}
                required
                error={errors.employee_id}
                hasMore={
                  employeePagination.page < employeePagination.total_pages
                }
                loadingMore={isLoadingEmployees}
                onLoadMore={() => fetchEmployees(employeePagination.page + 1)}
                onSearch={(term) => fetchEmployees(1, term)}
              />
            </div>

            {selectedEmployees.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">
                  {tRequest("selectedEmployees")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployees.map((employeeId) => {
                    const employee = employees.find(
                      (emp) => emp.id === employeeId
                    );
                    return (
                      <div
                        key={employeeId}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{employee?.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEmployee(employeeId)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${isDialog ? "flex-shrink-0 sticky bottom-0 bg-white pt-4 pb-2 " : ""} flex justify-center gap-4 ${isDialog ? "" : "!mt-[129px]"} px-2 mt-3`}
        >
          <SMSButton
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px]"
            type="submit"
            loading={formLoading}
            loadingText={tRequest("approvingRequest")}
            text={`${tactions("approve")} ${tactions("request")}`}
            startIcon={<FileCheck className="w-5 h-5" />}
          />
        </div>
      </form>
    </div>
  );
};

export default ReceiveRequestForm;

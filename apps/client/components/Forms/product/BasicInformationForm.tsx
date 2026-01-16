import { useState } from "react";
import { Plus } from "lucide-react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import MultiSelector from "@workspace/ui/components/custom/MultiSelector";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { Product } from "@/types/product";
import { AddSubcategoryDialog } from "@/components/Dialog/AddSubcategoryDialog";
import { locomotive } from "@/types/locomotive";
import { Route, RouteOption } from "@/types/shared/route";
import { BasicInformationProps } from "./components/productForm";
import { useCompany } from "@/providers/appProvider";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";
import { AddCustomerDialog } from "@/components/Dialog/AddCustomerDialog";

export function BasicInformationForm({
  product,
  customers,
  onUpdate,
  errors,
  routes,
  setRoutes,
  onContinue,
  pagination,
  handleLoadMoreCustomers,
  handleSearchCustomers,
  isLoadingCustomers,
  fetchCustomers,
  productCustomization,
  handleBack,
}: BasicInformationProps) {
  const { company } = useCompany();
  const [open, setOpen] = useState(false);
  const [addCustomerDialog, setAddCustomerDialog] = useState(false);

  const t = useTranslations("common");
  const tcommon = useTranslations("common.labels");
  const tsidebar = useTranslations("components.sidebar");
  const tactions = useTranslations("actions");

  const handleChange = (
    field: keyof Product,
    value: string | boolean | string[]
  ) => {
    if (field === "routes") {
      const routeIds = Array.isArray(value) ? value : [];

      const routes: Route[] = routeIds.map((routeId) => ({
        route_id: routeId,
        rate: 0,
        rate_type: "FLAT",
      }));

      onUpdate({
        ...product,
        routes,
      });
      return;
    }

    onUpdate({
      ...product,
      [field]: value,
    });
  };

  const handleAddSubcategory = (newSubcategory: locomotive) => {
    if (!newSubcategory.id) return;
    const newRoute: RouteOption = {
      value: newSubcategory.id.toString(),
      label: newSubcategory.name,
    };

    setRoutes((prevRoutes) => [...prevRoutes, newRoute]);
  };

  let hasLocomotive = company?.configuration?.has_locomotive;
  return (
    <div className="space-y-4 md:space-y-6  md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <SMSInput
          label={`${tsidebar("product")} ${tcommon("name")}`}
          value={product.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          error={errors.name}
          disabled={productCustomization}
        />

        <SMSCombobox
          label={` ${tsidebar("customer")}`}
          placeholder={` ${tsidebar("customer")}`}
          searchPlaceholder={t("search_customers")}
          value={product.customer_id}
          onValueChange={(value) => handleChange("customer_id", value)}
          options={customers.map((customer: any) => ({
            value: customer.id,
            label: customer.name,
          }))}
          required
          error={errors.customer_id}
          addNew={{
            text: t("add_customer"),
            onClick: () => setAddCustomerDialog(true),
          }}
          hasMore={pagination.page < pagination.total_pages}
          loadingMore={isLoadingCustomers}
          onLoadMore={handleLoadMoreCustomers}
          onSearch={handleSearchCustomers}
          disabled={productCustomization}
        />

        {hasLocomotive && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-xl md:text-[28px] font-semibold text-gray-700 ml-1">
                {`${tsidebar("locomotive")} `}
              </Label>
              <Switch
                checked={product.is_locomotive}
                onCheckedChange={(checked) =>
                  handleChange("is_locomotive", checked)
                }
              />
            </div>
          </div>
        )}

        {product.is_locomotive && hasLocomotive && (
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex gap-4">
                {" "}
                <Label className="text-base md:text-[18px] font-medium text-gray-700">
                  {`${t("select")} ${t("sub_category")}`}
                </Label>
                <SMSButton
                  className="w-8 h-8 bg-transparent  flex items-center justify-center rounded-full border border-[#14AE5C]-50  transition-colors hover:bg-transparent"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="w-5 h-5  stroke-[#14AE5C]" />
                </SMSButton>
              </div>

              {company && (
                <AddSubcategoryDialog
                  onAddSubcategory={handleAddSubcategory}
                  company={company}
                  open={open}
                  onClose={() => setOpen(false)}
                />
              )}
            </div>
            <MultiSelector
              label=""
              options={routes}
              selected={(product.routes || [])?.map(
                (route: Route) => route.route_id?.toString() || ""
              )}
              onChange={(values) => handleChange("routes", values)}
              error={errors.routes}
            />
          </div>
        )}
      </div>

      <div
        className={`flex ${handleBack ? "justify-between" : "justify-end"} gap-4 mt-6 md:mt-10`}
      >
        {handleBack && (
          <SMSButton
            className="bg-transparent shadow-none text-[18px] p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
            onClick={handleBack}
          >
            {tactions("back")}
          </SMSButton>
        )}
        <SMSButton
          className="w-full md:w-auto bg-black rounded-full px-4 md:px-8 py-2 md:py-3"
          onClick={onContinue}
        >
          {tactions("continue")}
        </SMSButton>
      </div>
      <AddCustomerDialog
        open={addCustomerDialog}
        onClose={() => {
          fetchCustomers && fetchCustomers();
          setAddCustomerDialog(false);
        }}
      />
    </div>
  );
}

export default BasicInformationForm;

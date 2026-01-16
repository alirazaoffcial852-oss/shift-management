"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Product, ProductPersonnelPricing } from "@/types/product";
import { Checkbox } from "@workspace/ui/components/checkbox";
import TypeSelection from "@workspace/ui/components/custom/TypeSelection";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { COSTING_TERMS } from "@/constants/shared/globals";
import { SelectedPersonnelDetailsFormProps } from "./components/productForm";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";
import { AddCustomerDialog } from "@/components/Dialog/AddCustomerDialog";

const SelectedPersonnelDetailsForm: React.FC<
  SelectedPersonnelDetailsFormProps
> = ({
  product,
  company,
  customers,
  onUpdate,
  errors,
  onSubmit,
  handleBack,
  isSubmitting = false,
  pagination,
  handleLoadMoreCustomers,
  handleSearchCustomers,
  isLoadingCustomers,
  fetchCustomers,
}) => {
  const tProduct = useTranslations("pages.products");
  const t = useTranslations("common");
  const tCommon = useTranslations("common.labels");
  const tSidebar = useTranslations("components.sidebar");
  const tActions = useTranslations("actions");
  const tRate = useTranslations("components.rate");

  const [activePersonnelIndex, setActivePersonnelIndex] = useState(0);
  const [applyToAll, setApplyToAll] = useState(false);
  const [addCustomerDialog, setAddCustomerDialog] = useState(false);

  const activePersonnel =
    product.productPersonnelPricings[activePersonnelIndex] || null;

  const getCompanyRoleName = (roleId: string) => {
    const role = company?.roles?.find(
      (role) =>
        role?.company_role_id?.toString() === roleId.toString() ||
        role?.id?.toString() === roleId.toString()
    );
    return role?.name || "Unknown Role";
  };

  const handleFlatPriceToggle = (checked: boolean) => {
    const updatedPersonnel = [...product.productPersonnelPricings].map(
      (personnel) => ({
        ...personnel,
        included_in_flat_price: checked
          ? personnel.included_in_flat_price
          : false,
        has_flat_price: checked,
      })
    );

    onUpdate({
      ...product,
      has_flat_price: checked,
      productPersonnelPricings: updatedPersonnel,
    });
  };

  const handleChange = (field: keyof Product, value: string | boolean) => {
    onUpdate({
      ...product,
      [field]: value,
    });
  };

  const handlePersonnelFlatPriceToggle = (
    personnelIndex: number,
    checked: boolean
  ) => {
    const updatedPersonnel = [...product.productPersonnelPricings];
    updatedPersonnel[personnelIndex] = {
      ...updatedPersonnel[personnelIndex],
      included_in_flat_price: checked,
      flat_price: checked ? product.flat_price : undefined,
    } as ProductPersonnelPricing;

    onUpdate({
      ...product,
      productPersonnelPricings: updatedPersonnel,
    });
  };

  const handlePersonnelFieldChange = (
    field: keyof ProductPersonnelPricing | string,
    value: any
  ) => {
    if (!activePersonnel) return;

    const updatedPersonnel = [...product.productPersonnelPricings];

    const setNestedProperty = (obj: any, path: string[], value: any) => {
      const key = path[0];
      if (path.length === 1) {
        if (key !== undefined) {
          obj[key] = value;
        }
      } else {
        if (key !== undefined && !obj[key]) obj[key] = {};
        if (key !== undefined) {
          setNestedProperty(obj[key], path.slice(1), value);
        }
      }
    };

    if (field.includes(".")) {
      const path = field.split(".");
      const clonedPersonnel = { ...updatedPersonnel[activePersonnelIndex] };
      setNestedProperty(clonedPersonnel, path, value);
      updatedPersonnel[activePersonnelIndex] =
        clonedPersonnel as ProductPersonnelPricing;
    } else {
      updatedPersonnel[activePersonnelIndex] = {
        ...updatedPersonnel[activePersonnelIndex],
        [field]: value,
      } as ProductPersonnelPricing;
    }

    onUpdate({
      ...product,
      productPersonnelPricings: updatedPersonnel,
    });
  };

  // Apply current STATUS pricing to all personnel
  const applyPricingToAllPersonnel = (checked: boolean) => {
    // Update the state to reflect checkbox status
    setApplyToAll(checked);

    // Only apply the pricing if checked is true
    if (
      checked &&
      activePersonnel &&
      product.productPersonnelPricings.length > 1
    ) {
      const currentPersonnel =
        product.productPersonnelPricings[activePersonnelIndex];
      const updatedPersonnel = product.productPersonnelPricings.map(
        (personnel, index) => {
          if (index === activePersonnelIndex) return personnel;

          if (currentPersonnel) {
            return {
              ...personnel,
              costing_terms: currentPersonnel.costing_terms,
              far_away_hourly_rate: currentPersonnel.far_away_hourly_rate || 0,
              nearby_hourly_rate: currentPersonnel.nearby_hourly_rate || 0,
              personnelNightShiftPricing: {
                ...personnel.personnelNightShiftPricing,
                night_time_rate:
                  currentPersonnel.personnelNightShiftPricing
                    ?.night_time_rate || 0,
                night_time_rate_type:
                  currentPersonnel.personnelNightShiftPricing
                    ?.night_time_rate_type || "FLAT",
                night_shift_start_at:
                  currentPersonnel.personnelNightShiftPricing
                    ?.night_shift_start_at || "",
                night_shift_end_at:
                  currentPersonnel.personnelNightShiftPricing
                    ?.night_shift_end_at || "",
              },
              personnelTravellingPricing: {
                ...personnel.personnelTravellingPricing,
                travel_time_rate:
                  currentPersonnel.personnelTravellingPricing
                    ?.travel_time_rate || 0,
                travel_time_rate_type:
                  currentPersonnel.personnelTravellingPricing
                    ?.travel_time_rate_type || "FLAT",
                travel_allowance_departure:
                  currentPersonnel.personnelTravellingPricing
                    ?.travel_allowance_departure || 0,
                travel_allowance_departure_type:
                  currentPersonnel.personnelTravellingPricing
                    ?.travel_allowance_departure_type || "FLAT",
                travel_allowance_arrival:
                  currentPersonnel.personnelTravellingPricing
                    ?.travel_allowance_arrival || 0,
                travel_allowance_arrival_type:
                  currentPersonnel.personnelTravellingPricing
                    ?.travel_allowance_arrival_type || "FLAT",
                full_day_travel_allowance:
                  currentPersonnel.personnelTravellingPricing
                    ?.full_day_travel_allowance || 0,
                full_day_travel_allowance_type:
                  currentPersonnel.personnelTravellingPricing
                    ?.full_day_travel_allowance_type || "FLAT",
              },
              personnelHolidayPricing: {
                ...personnel.personnelHolidayPricing,
                holiday_rate:
                  currentPersonnel.personnelHolidayPricing?.holiday_rate || 0,
                holiday_rate_type:
                  currentPersonnel.personnelHolidayPricing?.holiday_rate_type ||
                  "FLAT",
                sunday_rate:
                  currentPersonnel.personnelHolidayPricing?.sunday_rate || 0,
                sunday_rate_type:
                  currentPersonnel.personnelHolidayPricing?.sunday_rate_type ||
                  "FLAT",
              },
            } as ProductPersonnelPricing;
          }
          return personnel;
        }
      );

      onUpdate({
        ...product,
        productPersonnelPricings: updatedPersonnel,
      });
    }
  };

  // Early return if no personnel available
  if (
    !product.productPersonnelPricings ||
    product.productPersonnelPricings.length === 0
  ) {
    return (
      <Card className="w-full shadow-none border-none p-0">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">
              No personnel selected
            </h2>
            <p className="mb-4">
              Please go back and select personnel roles first.
            </p>
            <SMSButton
              onClick={handleBack}
              className="bg-black text-white rounded-full hover:bg-gray-800"
            >
              Back to Personnel Selection
            </SMSButton>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full shadow-none border-none p-0">
      <CardContent className="">
        <div className="space-y-8">
          <div className="bg-[#E2F5DE] rounded-lg p-6">
            <h2 className="text-[28px] font-semibold mb-4">
              {tProduct("initial_data")}
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="space-y-2">
                  <SMSInput
                    label={`${tSidebar("product")}`}
                    value={product.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    error={errors.name}
                  />
                </div>
              </div>

              <SMSCombobox
                label={`${tSidebar("customer")}`}
                placeholder={`${tSidebar("customer")}`}
                searchPlaceholder="Search customers..."
                value={product.customer_id}
                onValueChange={(value) => handleChange("customer_id", value)}
                options={customers.map((customer: any) => ({
                  value: customer.id,
                  label: customer.name,
                }))}
                required
                error={errors.customer_id}
                addNew={{
                  text: "Add Customer",
                  onClick: () => setAddCustomerDialog(true),
                }}
                hasMore={pagination.page < pagination.total_pages}
                loadingMore={isLoadingCustomers}
                onLoadMore={handleLoadMoreCustomers}
                onSearch={handleSearchCustomers}
              />
              <div className="space-y-2">
                <div className="space-y-2">
                  <SMSInput
                    label={tRate("shift_flat_rate")}
                    value={product.shift_flat_rate ?? ""}
                    onChange={(e) =>
                      handleChange("shift_flat_rate", e.target.value)
                    }
                    error={errors.shift_flat_rate}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-4 space-x-2">
                  <Label className="text-base md:text-[18px] font-medium text-gray-700 ml-1">
                    {tProduct("has_flat_price")}
                  </Label>
                  <Switch
                    checked={product.has_flat_price || false}
                    onCheckedChange={handleFlatPriceToggle}
                  />
                </div>
                <div className="space-y-2">
                  <SMSInput
                    placeholder={tRate("flat_price")}
                    value={product.flat_price?.toString() || ""}
                    onChange={(e) => handleChange("flat_price", e.target.value)}
                    error={errors.flat_price}
                    className="bg-white"
                    disabled={!product.has_flat_price}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personnel Tabs */}
          <div className="space-y-4 px-6">
            <div className="flex  gap-4 overflow-x-auto pb-2">
              {product.productPersonnelPricings.map((personnel, index) => (
                <SMSButton
                  key={personnel.company_personnel_id}
                  variant="outline"
                  className={`rounded-full capitalize ${
                    index === activePersonnelIndex
                      ? "bg-[#3E8258] text-white hover:bg-[#3E8258] hover:text-white"
                      : "bg-white text-black hover:bg-[#3E8258] hover:text-white"
                  }    whitespace-nowrap h-[44px] text-[14px] font-medium`}
                  onClick={() => setActivePersonnelIndex(index)}
                >
                  {getCompanyRoleName(
                    personnel.company_personnel_id?.toString() || ""
                  )}
                  {product.has_flat_price && (
                    <Checkbox
                      id={`personnel-${index}`}
                      tickColor={
                        index !== activePersonnelIndex ? "#FFFFFF" : "#3E8258"
                      }
                      bgColor={
                        index === activePersonnelIndex ? "#FFFFFF" : "black"
                      }
                      checked={personnel.included_in_flat_price}
                      onCheckedChange={(checked) =>
                        handlePersonnelFlatPriceToggle(index, !!checked)
                      }
                      className="ml-2"
                    />
                  )}
                </SMSButton>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-2">
                <SMSInput
                  label={tRate("far_away_hourly_rate")}
                  placeholder={tRate("far_away_hourly_rate")}
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  value={
                    activePersonnel?.far_away_hourly_rate?.toString() || ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "far_away_hourly_rate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].far_away_hourly_rate`
                    ]
                  }
                />
              </div>
              <div className="space-y-2">
                <SMSInput
                  label={tRate("nearby_hourly_rate")}
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  placeholder="Enter nearby hourly rate"
                  value={activePersonnel?.nearby_hourly_rate?.toString() || ""}
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "nearby_hourly_rate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].nearby_hourly_rate`
                    ]
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base md:text-[18px] font-semibold text-gray-700 ml-1">
                  {tRate("costing_terms")}
                </Label>
                <Select
                  value={activePersonnel?.costing_terms.toString()}
                  onValueChange={(value) =>
                    handlePersonnelFieldChange("costing_terms", value)
                  }
                >
                  <SelectTrigger className="h-12 rounded-[16px]">
                    <SelectValue placeholder="Select a Costing term" />
                  </SelectTrigger>
                  <SelectContent>
                    {COSTING_TERMS.map((costing, i) => (
                      <SelectItem key={i} value={costing.value}>
                        {costing.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-red-500">
                  {errors[`personnel[${activePersonnelIndex}].costing_terms`]}
                </p>
              </div>
            </div>
          </div>

          {/* Night Shift Section */}
          <div className="space-y-2 px-6">
            <h2 className="text-[28px] font-semibold mb-4">
              {" "}
              {tProduct("night_shift")}
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-2">
                <SMSInput
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  type="time"
                  label={tRate("night_shift_start_at")}
                  placeholder={tRate("night_shift_start_at")}
                  value={
                    activePersonnel?.personnelNightShiftPricing?.night_shift_start_at?.toString() ||
                    ""
                  }
                  onChange={(e) => {
                    handlePersonnelFieldChange(
                      "personnelNightShiftPricing.night_shift_start_at",
                      e.target.value
                    );
                  }}
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelNightShiftPricing.night_shift_start_at`
                    ]
                  }
                />
              </div>
              <div className="space-y-2">
                <SMSInput
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  type="time"
                  label={tRate("night_shift_end_at")}
                  placeholder={tRate("night_shift_end_at")}
                  value={
                    activePersonnel?.personnelNightShiftPricing?.night_shift_end_at?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelNightShiftPricing.night_shift_end_at",
                      e.target.value
                    )
                  }
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelNightShiftPricing.night_shift_end_at`
                    ]
                  }
                />
              </div>
              <div className="space-y-2">
                <TypeSelection
                  label={tRate("night_time_rate")}
                  name={tRate("night_time_rate")}
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  value={
                    activePersonnel?.personnelNightShiftPricing?.night_time_rate?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelNightShiftPricing.night_time_rate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="Night Time Rate"
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelNightShiftPricing.night_time_rate`
                    ]
                  }
                  type={
                    activePersonnel?.personnelNightShiftPricing
                      ?.night_time_rate_type || "FLAT"
                  }
                  onTypeChange={(type) =>
                    handlePersonnelFieldChange(
                      "personnelNightShiftPricing.night_time_rate_type",
                      type
                    )
                  }
                  required={true}
                />
              </div>
            </div>
          </div>

          {/* Travelling Section */}
          <div className="space-y-2 px-6">
            <h2 className="text-[28px] font-semibold mb-4">
              {tProduct("travelling")}
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-2">
                <TypeSelection
                  label={tRate("travel_time_rate")}
                  name="travel_time_rate"
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  value={
                    activePersonnel?.personnelTravellingPricing?.travel_time_rate?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.travel_time_rate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={tRate("travel_time_rate")}
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelTravellingPricing.travel_time_rate`
                    ]
                  }
                  type={
                    activePersonnel?.personnelTravellingPricing
                      ?.travel_time_rate_type || "FLAT"
                  }
                  onTypeChange={(type) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.travel_time_rate_type",
                      type
                    )
                  }
                  required={true}
                />
              </div>
              <div className="space-y-2">
                <TypeSelection
                  label={tRate("travel_allowance_departure")}
                  name="travel_allowance_departure"
                  value={
                    activePersonnel?.personnelTravellingPricing?.travel_allowance_departure?.toString() ||
                    ""
                  }
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.travel_allowance_departure",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={tRate("travel_allowance_departure")}
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelTravellingPricing.travel_allowance_departure`
                    ]
                  }
                  type={
                    activePersonnel?.personnelTravellingPricing
                      ?.travel_allowance_departure_type || "FLAT"
                  }
                  onTypeChange={(type) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.travel_allowance_departure_type",
                      type
                    )
                  }
                  required={true}
                />
              </div>
              <div className="space-y-2">
                <TypeSelection
                  label={tRate("travel_allowance_arrival")}
                  name="travel_allowance_arrival"
                  value={
                    activePersonnel?.personnelTravellingPricing?.travel_allowance_arrival?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.travel_allowance_arrival",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={tRate("travel_allowance_arrival")}
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelTravellingPricing.travel_allowance_arrival`
                    ]
                  }
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  type={
                    activePersonnel?.personnelTravellingPricing
                      ?.travel_allowance_arrival_type || "FLAT"
                  }
                  onTypeChange={(type) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.travel_allowance_arrival_type",
                      type
                    )
                  }
                  required={true}
                />
              </div>
              <div className="space-y-2">
                <TypeSelection
                  label={tRate("full_day_travel_allowance")}
                  name="full_day_travel_allowance"
                  value={
                    activePersonnel?.personnelTravellingPricing?.full_day_travel_allowance?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.full_day_travel_allowance",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={tRate("full_day_travel_allowance")}
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelTravellingPricing.full_day_travel_allowance`
                    ]
                  }
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  type={
                    activePersonnel?.personnelTravellingPricing
                      ?.full_day_travel_allowance_type || "FLAT"
                  }
                  onTypeChange={(type) =>
                    handlePersonnelFieldChange(
                      "personnelTravellingPricing.full_day_travel_allowance_type",
                      type
                    )
                  }
                  required={true}
                />
              </div>
            </div>
          </div>

          {/* Holidays Section */}
          <div className="space-y-6 px-6">
            <h2 className="text-[28px] font-semibold mb-4">
              {tProduct("Holidays")}
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-2">
                <TypeSelection
                  label={tRate("holiday_rate")}
                  name="holiday_rate"
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  value={
                    activePersonnel?.personnelHolidayPricing?.holiday_rate?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelHolidayPricing.holiday_rate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={tRate("holiday_rate")}
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelHolidayPricing.holiday_rate`
                    ]
                  }
                  type={
                    activePersonnel?.personnelHolidayPricing
                      ?.holiday_rate_type || "FLAT"
                  }
                  onTypeChange={(type) =>
                    handlePersonnelFieldChange(
                      "personnelHolidayPricing.holiday_rate_type",
                      type
                    )
                  }
                  required={true}
                />
              </div>
              <div className="space-y-2">
                <TypeSelection
                  label={tRate("sunday_rate")}
                  name="sunday_rate"
                  disabled={
                    product.productPersonnelPricings[activePersonnelIndex]
                      ?.included_in_flat_price || false
                  }
                  value={
                    activePersonnel?.personnelHolidayPricing?.sunday_rate?.toString() ||
                    ""
                  }
                  onChange={(e) =>
                    handlePersonnelFieldChange(
                      "personnelHolidayPricing.sunday_rate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder={tRate("sunday_rate")}
                  error={
                    errors[
                      `personnel[${activePersonnelIndex}].personnelHolidayPricing.sunday_rate`
                    ]
                  }
                  type={
                    activePersonnel?.personnelHolidayPricing
                      ?.sunday_rate_type || "FLAT"
                  }
                  onTypeChange={(type) =>
                    handlePersonnelFieldChange(
                      "personnelHolidayPricing.sunday_rate_type",
                      type
                    )
                  }
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4 px-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="apply_to_all"
                tickColor="#FFFFFF"
                bgColor="#3E8258"
                checked={product?.show_in_dropdown}
                onCheckedChange={(e) => handleChange("show_in_dropdown", e)}
              />
              <Label className="text-[14px] font-medium ml-1">
                {tProduct("Show_this_Product_in_the_Dropdown_of_Create_shift")}
              </Label>
            </div>
          </div>
          {product.productPersonnelPricings.length > 1 && (
            <div className="space-y-4 px-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply_to_all"
                  tickColor="#FFFFFF"
                  bgColor="#3E8258"
                  checked={applyToAll}
                  onCheckedChange={applyPricingToAllPersonnel}
                />
                <Label className="text-[14px] font-medium ml-1">
                  {tProduct("Make_all_the_pricing_same_for_all_the_personnels")}
                </Label>
              </div>
            </div>
          )}
          <AddCustomerDialog
            open={addCustomerDialog}
            onClose={() => {
              setAddCustomerDialog(false);
              fetchCustomers && fetchCustomers();
            }}
          />
          <div className="flex justify-between pt-4">
            <Button
              variant="link"
              className="bg-transparent text-[18px] p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
              onClick={handleBack}
            >
              {tActions("back")}
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="bg-black text-white rounded-full hover:bg-gray-800"
            >
              {tActions("save")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedPersonnelDetailsForm;

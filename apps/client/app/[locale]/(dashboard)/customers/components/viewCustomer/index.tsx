"use client";
import React from "react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useRouter } from "next/navigation";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { Plus } from "lucide-react";
import { useCustomerTable } from "@/hooks/customer/useCustomerTable";
import { Customer } from "@/types/customer";
import { OPTIONS } from "@/constants/tabsOption.constant";
import { useTranslations } from "next-intl";
import {
  customerActionCallbacks,
  getActions,
  getColumns,
} from "./table-essentails";
import { usePermission } from "@/hooks/usePermission";

const ViewCustomer = () => {
  const router = useRouter();
  const tcustomer = useTranslations("components.sidebar");
  const tCustomers = useTranslations("pages.customers");
  const { hasPermission } = usePermission();
  const {
    customers,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    updateCustomerStatus,
    removeCustomer,
    tabValue,
    setTabValue,
  } = useCustomerTable();

  const actionCallbacks: customerActionCallbacks = {
    onDelete: removeCustomer,
    onStatusUpdate: updateCustomerStatus,
  };
  const actions = getActions();
  const actionsWithCallbacks = actions
    .filter((action) => {
      if (action.label?.toLowerCase().includes("edit")) {
        return hasPermission("customer.update");
      }
      if (action.label?.toLowerCase().includes("delete")) {
        return hasPermission("customer.delete");
      }
      return true;
    })
    .map((action) => ({
      ...action,
      element: (customer: Customer) => {
        if (customer.id !== undefined) {
          return action.element(
            customer as Required<Customer>,
            actionCallbacks
          );
        }
        return null;
      },
    }));
  const columns = getColumns();

  return (
    <div className="space-y-4 px-0 lg:px-[30px]">
      <div className="flex justify-between items-center ">
        <h2>{tcustomer("customer")}</h2>
        {hasPermission("customer.create") && (
          <SMSButton
            text={`Add ${tcustomer("customer")}`}
            startIcon={<Plus className="h-4 w-4" />}
            className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
            onClick={() => router.push("/customers/add")}
          />
        )}
      </div>
      <Tabs
        options={[...OPTIONS.tabs]}
        value={tabValue}
        onChange={setTabValue}
      />

      <SMSTable
        columns={columns}
        data={customers}
        actions={actionsWithCallbacks}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onTimeFilterChange={handleTimeFilterChange}
        onDateRangeChange={handleDateRangeChange}
        onSearchChange={handleSearch}
        dateTimeFilter={true}
        actionsHeader={tCustomers("actions")}
      />
    </div>
  );
};

export default ViewCustomer;

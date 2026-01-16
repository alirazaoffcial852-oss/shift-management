import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useCustomerTable } from "@/hooks/customer/useCustomerTable";
import { useStaffTable } from "@/hooks/staff/useStaffTable";
import { Switch } from "@workspace/ui/components/switch";
import { CustomerSectionProps } from "./types/form";
import { useProjectForm } from "@/hooks/project/useProjectForm";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";

export function CustomerSection({
  shifts,
  onUpdate,
  errors,
}: CustomerSectionProps) {
  const t = useTranslations("pages.shift");

  const {
    customers,
    pagination: customerPagination,
    isLoadingCustomers,
    handleLoadMoreCustomers,
    handleSearchCustomers,
  } = useProjectForm();

  const { staff } = useStaffTable();

  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers?.find(
      (customer) => customer?.id?.toString() === customerId
    );

    if (selectedCustomer) {
      onUpdate("customer_id", customerId);
      onUpdate("phone_no", selectedCustomer.phone);
      onUpdate("shiftDetail", {
        ...shifts.shiftDetail,
        contact_person_name: selectedCustomer.contact_person_name,
        contact_person_phone: selectedCustomer.contact_person_phone,
        has_contact_person: true,
      });
    }
  };

  return (
    <div>
      <h3>{t("customer_and_contact_person")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 !mt-[44px]">
        <div className="space-y-2">
          <SMSCombobox
            label={t("customers")}
            placeholder={t("customers")}
            searchPlaceholder={t("search_customers")}
            value={shifts.customer_id}
            onValueChange={(value) => {}}
            options={customers.map((customer: any) => ({
              value: customer.id?.toString(),
              label: customer.name,
            }))}
            required
            hasMore={customerPagination.page < customerPagination.total_pages}
            loadingMore={isLoadingCustomers}
            onLoadMore={handleLoadMoreCustomers}
            onSearch={handleSearchCustomers}
            disabled={true}
          />
        </div>

        <SMSInput
          label={t("phone_no")}
          placeholder={t("enter_phone_number")}
          value={shifts.phone_no}
          onChange={(e) => onUpdate("phone_no", e.target.value)}
          required
          error={errors.phone_no}
        />
        <div className="col-span-1 md:col-span-2 flex gap-10 items-center !my-[25px]">
          <h3>{t("contact_person")}</h3>
          <Switch
            checked={shifts.shiftDetail.has_contact_person}
            onCheckedChange={(checked) =>
              onUpdate("shiftDetail", {
                ...shifts.shiftDetail,
                has_contact_person: checked,
              })
            }
          />
        </div>
      </div>

      {shifts.shiftDetail.has_contact_person && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SMSInput
            label={t("contact_person_name")}
            placeholder={t("enter_name")}
            value={shifts.shiftDetail.contact_person_name}
            onChange={(e) =>
              onUpdate("shiftDetail", {
                ...shifts.shiftDetail,
                contact_person_name: e.target.value,
              })
            }
            required
            error={errors.contact_person_name}
            disabled={!shifts.shiftDetail.has_contact_person}
          />

          <SMSInput
            label={t("emergency_phone_no")}
            placeholder={t("enter_emergency_phone_number")}
            value={shifts.shiftDetail.contact_person_phone}
            onChange={(e) =>
              onUpdate("shiftDetail", {
                ...shifts.shiftDetail,
                contact_person_phone: e.target.value,
              })
            }
            required
            error={errors.contact_person_phone}
            disabled={!shifts.shiftDetail.has_contact_person}
          />
          <div className="space-y-2">
            <Label className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1">
              {t("dispatcher")}
            </Label>
            <Select
              value={shifts.dispatcher_id}
              onValueChange={(value) => onUpdate("dispatcher_id", value)}
            >
              <SelectTrigger className="h-[54px] w-full rounded-[16px]">
                <SelectValue placeholder={t("select_dispatcher_name")} />
              </SelectTrigger>
              <SelectContent>
                {staff?.map((data) => (
                  <SelectItem key={data.id} value={String(data.id)}>
                    {data.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.dispatcher_id && (
              <p className="text-sm text-red-500">{errors.dispatcher_id}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

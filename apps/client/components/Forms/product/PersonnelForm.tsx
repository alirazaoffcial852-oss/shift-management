import { ProductPersonnelPricing } from "@/types/product";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Label } from "@workspace/ui/components/label";
import { PersonnelSelectionFormProps } from "./components/productForm";
import { useTranslations } from "next-intl";
import { useReceiveRequestForm } from "@/hooks/receiveRequest/useReceiveRequestHook";

export function PersonnelSelectionForm({
  product,
  onUpdate,
  errors,
  onContinue,
  company,
  handleBack,
  isSubmitting = false,
}: PersonnelSelectionFormProps) {
  const tProduct = useTranslations("pages.products");
  const tAction = useTranslations("actions");
  const { roles } = useReceiveRequestForm();

  const rolesOptions =
    company?.roles
      ?.filter((role) => role.act_as !== "STAFF")
      .map((role) => ({
        label: role.name,
        value: role?.company_role_id
          ? role?.company_role_id?.toString()
          : role?.id?.toString() || "",
      })) || [];

  const createDefaultPersonnel = (roleId: string): ProductPersonnelPricing => {
    return {
      company_personnel_id: Number(roleId),
      far_away_hourly_rate: 0,
      nearby_hourly_rate: 0,
      costing_terms: "COUNT_HOLIDAY_SURCHARGES_COST_ONLY",
      included_in_flat_price: false,
      personnelNightShiftPricing: {
        night_time_rate: 0,
        night_time_rate_type: "FLAT",
        night_shift_start_at: "",
        night_shift_end_at: "",
      },
      personnelTravellingPricing: {
        travel_time_rate: 0,
        travel_time_rate_type: "FLAT",
        travel_allowance_departure: 0,
        travel_allowance_departure_type: "FLAT",
        travel_allowance_arrival: 0,
        travel_allowance_arrival_type: "FLAT",
        full_day_travel_allowance: 0,
        full_day_travel_allowance_type: "FLAT",
      },
      personnelHolidayPricing: {
        holiday_rate: 0,
        holiday_rate_type: "FLAT",
        sunday_rate: 0,
        sunday_rate_type: "FLAT",
      },
    };
  };

  const isRoleSelected = (roleId: string): boolean => {
    return product.productPersonnelPricings.some(
      (p) => p.company_personnel_id?.toString() === roleId
    );
  };

  const handleRoleChange = (roleId: string) => {
    let updatedPersonnel = [...product.productPersonnelPricings];

    if (isRoleSelected(roleId)) {
      updatedPersonnel = updatedPersonnel.filter(
        (p) => p.company_personnel_id !== Number(roleId)
      );
    } else {
      updatedPersonnel.push(createDefaultPersonnel(roleId));
    }
    onUpdate({
      ...product,
      productPersonnelPricings: updatedPersonnel,
    });
  };

  // const rolesOptions =
  //   roles
  //     ?.filter((role) => role?.act_as !== "STAFF")
  //     .map((role) => ({
  //       label: role?.name,
  //       value: role?.company_role_id
  //         ? role?.company_role_id?.toString()
  //         : role?.id?.toString() || "",
  //     })) || [];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md px-10 py-6 mt-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">
          {tProduct("select_personal_roles")}
        </h3>
        {rolesOptions.map((role) => (
          <div key={role.value} className="flex items-center space-x-2">
            <Checkbox
              id={`role-${role.value}`}
              checked={isRoleSelected(role.value)}
              onCheckedChange={() => handleRoleChange(role.value)}
              className="border-2 border-gray-200 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            />
            <Label
              htmlFor={`role-${role.value}`}
              className="text-[18px] font-medium ml-1 capitalize"
            >
              {role.label}
            </Label>
          </div>
        ))}
        {(errors.personnel || errors.productPersonnelPricings) && (
          <p className="text-red-500 text-sm mt-1">
            {errors.personnel || errors.productPersonnelPricings}
          </p>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <SMSButton
          className="bg-transparent shadow-none text-[18px] p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
          onClick={handleBack}
        >
          {tAction("back")}
        </SMSButton>
        <SMSButton
          className="bg-black rounded-full"
          onClick={onContinue}
          disabled={isSubmitting}
        >
          {tAction("continue")}
        </SMSButton>
      </div>
    </div>
  );
}

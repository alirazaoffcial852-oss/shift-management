"use client";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { PersonalDetailFormProps } from "./types/form";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { useEmployeeTable } from "@/hooks/employee/useEmployeeTable";
import React, { useState, useRef } from "react";
import { AddEmployeeDialog } from "@/components/Dialog/AddEmployeeDialog";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

export function PersonalDetail({
  shifts,
  onUpdate,
  errors,
  product,
}: PersonalDetailFormProps) {
  const t = useTranslations("pages.personnel");
  const { employees, refetch: fetchEmployees } = useEmployeeTable();
  const [addEmployeeDialog, setAddEmployeeDialog] = useState(false);
  const lastFetchedProductId = useRef<string | number | undefined>(undefined);

  const handleRoleChange = (roleId: string, field: string, value: string) => {
    const newShifts = { ...shifts };
    const roleIndex = newShifts.shiftRole?.findIndex(
      (role: { role_id: { toString: () => string } }) =>
        role.role_id.toString() === roleId.toString()
    );

    if (roleIndex === -1) {
      if (!newShifts.shiftRole) {
        newShifts.shiftRole = [];
      }
      newShifts.shiftRole = newShifts.shiftRole || [];
      newShifts.shiftRole.push({
        role_id: roleId,
        employee_id: "",
        proximity: "NEARBY",
        break_duration: "0",
        start_day: "NO",
      });
    }

    const updatedRole =
      roleIndex !== undefined ? newShifts.shiftRole?.[roleIndex] : undefined;
    if (updatedRole) {
      (updatedRole[field as keyof typeof updatedRole] as string) = value;
    }
    onUpdate(newShifts);
  };

  const toggleRole = (roleId: string, enabled: boolean) => {
    const newShifts = { ...shifts };
    if (!newShifts.shiftRole) {
      newShifts.shiftRole = [];
    }

    if (
      !newShifts.shiftRole.find(
        (role: { role_id: { toString: () => string } }) =>
          role.role_id.toString() === roleId.toString()
      )
    ) {
      newShifts.shiftRole.push({
        role_id: roleId,
        employee_id: "",
        proximity: "NEARBY",
        break_duration: "0",
        start_day: "NO",
        isDisabled: false,
      });
    } else {
      const roleIndex = newShifts.shiftRole.findIndex(
        (r: { role_id: { toString: () => string } }) =>
          r.role_id.toString() === roleId.toString()
      );
      if (roleIndex !== -1) {
        if (newShifts.shiftRole[roleIndex]) {
          newShifts.shiftRole[roleIndex].isDisabled = !enabled;
        }
      }
    }
    onUpdate(newShifts);
  };

  React.useEffect(() => {
    if (!product) return;

    product?.productPersonnelPricings.forEach((personnel) => {
      const role = personnel?.personnel?.role;
      if (
        role &&
        !shifts.shiftRole?.some(
          (r: { role_id: { toString: () => string } }) =>
            r.role_id.toString() === String(role.id)
        )
      ) {
        toggleRole(String(role.id), true);
      }
    });
  }, [product, shifts.shiftRole]);

  React.useEffect(() => {
    if (product?.id) {
      const currentProductId = product.id.toString();
      const lastProductId = lastFetchedProductId.current?.toString();

      if (currentProductId !== lastProductId) {
        lastFetchedProductId.current = product.id;
        if (fetchEmployees) {
          fetchEmployees().catch((error) => {
            console.error("Error fetching employees:", error);
          });
        }
      }
    } else {
      lastFetchedProductId.current = undefined;
    }
  }, [product?.id, fetchEmployees]);

  const handlerListOfEmployees = (id: string) => {
    let listOfEmployees = employees.filter((employee) => {
      if (employee.role.id.toString() === id.toString()) {
        return true;
      }
      return false;
    });
    return listOfEmployees;
  };

  const handleOpenAddEmployeeDialog = () => {
    setAddEmployeeDialog(true);
  };

  const handleCloseEmployeeDialog = async () => {
    setAddEmployeeDialog(false);
    if (fetchEmployees) {
      await fetchEmployees();
    }
  };

  return (
    <div className="space-y-3 mt-[54px]">
      <h3>{t("title")}</h3>

      {product?.productPersonnelPricings.map((personnel, index) => {
        const role = personnel?.personnel?.role;
        const roleData = shifts.shiftRole?.find(
          (r: { role_id: { toString: () => string } }) =>
            r.role_id.toString() === String(role?.id)
        );
        const isEnabled = !roleData?.isDisabled;
        const roleEmployees = role?.id
          ? handlerListOfEmployees(role.id.toString())
          : [];
        const hasEmployees = roleEmployees.length > 0;

        return (
          <div key={role?.id} className="mt-6">
            <div className="flex items-center space-x-4 mt-6">
              <Label className=" text-[22px] sm:text-[22px] font-semibold text-[#2D2E33] capitalize pl-2">
                {role?.name}
              </Label>
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) =>
                  role && toggleRole(String(role.id), checked)
                }
              />
              <p className="text-[10px] font-semibold">
                {isEnabled ? t("enabled") : t("disabled")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  value={roleData?.employee_id?.toString() || ""}
                  onValueChange={(value) =>
                    handleRoleChange(String(role?.id), "employee_id", value)
                  }
                  disabled={!isEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectEmployee")} />
                  </SelectTrigger>
                  <SelectContent>
                    {hasEmployees &&
                      role?.id &&
                      roleEmployees.map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={String(employee.id)}
                        >
                          {employee.name}
                        </SelectItem>
                      ))}

                    {!hasEmployees && (
                      <div className="flex justify-center py-2 px-2">
                        <p className="text-sm text-gray-500">
                          {t("noEmployeesFound")}
                        </p>
                      </div>
                    )}

                    <div
                      className="flex justify-center py-3 px-2 border-t"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={handleOpenAddEmployeeDialog}
                        className="flex items-center justify-center text-sm text-emerald-600 font-medium bg-emerald-50 hover:bg-emerald-100 transition-colors py-2 px-3 rounded-md w-full"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t("addNewEmployee")}
                      </button>
                    </div>
                  </SelectContent>
                </Select>
                {(errors[`shiftRole.${role?.id}.employee_id`] ||
                  errors[`shiftRole[${role?.id}].employee_id`]) && (
                  <p className="text-sm text-red-500">
                    {errors[`shiftRole.${role?.id}.employee_id`] ||
                      errors[`shiftRole[${role?.id}].employee_id`]}
                  </p>
                )}
              </div>

              <div>
                <Select
                  value={roleData?.proximity}
                  onValueChange={(value) =>
                    handleRoleChange(String(role?.id), "proximity", value)
                  }
                  disabled={!isEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectProximity")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEARBY">{t("nearby")}</SelectItem>
                    <SelectItem value="FAR_AWAY">{t("farAway")}</SelectItem>
                  </SelectContent>
                </Select>
                {(errors[`shiftRole.${role?.id}.proximity`] ||
                  errors[`shiftRole[${role?.id}].proximity`]) && (
                  <p className="text-sm text-red-500">
                    {errors[`shiftRole.${role?.id}.proximity`] ||
                      errors[`shiftRole[${role?.id}].proximity`]}
                  </p>
                )}
              </div>

              <div>
                <SMSInput
                  value={roleData?.break_duration || "0"}
                  onChange={(e) =>
                    handleRoleChange(
                      String(role?.id),
                      "break_duration",
                      e.target.value
                    )
                  }
                  type="number"
                  disabled={!isEnabled}
                  placeholder={t("enterBreakDuration")}
                  error={
                    errors[`shiftRole.${role?.id}.break_duration`] ||
                    errors[`shiftRole[${role?.id}].break_duration`]
                  }
                />
              </div>

              <div>
                <Select
                  value={roleData?.start_day.toString()}
                  onValueChange={(value) =>
                    handleRoleChange(String(role?.id), "start_day", value)
                  }
                  disabled={!isEnabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStartDay")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">{t("yes")}</SelectItem>
                    <SelectItem value="NO">{t("no")}</SelectItem>
                  </SelectContent>
                </Select>
                {(errors[`shiftRole.${role?.id}.start_day`] ||
                  errors[`shiftRole[${role?.id}].start_day`]) && (
                  <p className="text-sm text-red-500">
                    {errors[`shiftRole.${role?.id}.start_day`] ||
                      errors[`shiftRole[${role?.id}].start_day`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {errors["shiftRole"] && (
        <p className="text-sm text-red-500">{errors["shiftRole"]}</p>
      )}

      <AddEmployeeDialog
        open={addEmployeeDialog}
        onClose={handleCloseEmployeeDialog}
      />
    </div>
  );
}

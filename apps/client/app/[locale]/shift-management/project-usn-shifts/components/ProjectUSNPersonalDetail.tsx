"use client";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
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
import React, { useState, useEffect, useCallback } from "react";
import { AddEmployeeDialog } from "@/components/Dialog/AddEmployeeDialog";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product";
import { ProjectUSNFormData } from "@/types/projectUsn";

interface ProjectUSNPersonalDetailProps {
  formData: ProjectUSNFormData;
  onUpdate: (field: keyof ProjectUSNFormData, value: any) => void;
  errors: { [key: string]: string };
  product: Product;
}

export function ProjectUSNPersonalDetail({
  formData,
  onUpdate,
  errors,
  product,
}: ProjectUSNPersonalDetailProps) {
  const t = useTranslations("pages.personnel");
  const { employees, refetch: fetchEmployees } = useEmployeeTable();
  const [addEmployeeDialog, setAddEmployeeDialog] = useState(false);

  const handleRoleChange = useCallback(
    (roleId: string, field: string, value: string) => {
      const newShiftRoles = [...(formData.shiftRole || [])];
      const roleIndex = newShiftRoles.findIndex(
        (role) => role.role_id.toString() === roleId.toString()
      );

      if (roleIndex === -1) {
        newShiftRoles.push({
          role_id: roleId,
          employee_id: "",
          proximity: "NEARBY",
          break_duration: "0",
          start_day: "NO",
          isDisabled: false,
          [field]: value,
        });
      } else {
        const existingRole = newShiftRoles[roleIndex];
        if (!existingRole) {
          return;
        }
        newShiftRoles[roleIndex] = {
          ...existingRole,
          [field]: value,
        };
      }

      onUpdate("shiftRole", newShiftRoles);
    },
    [formData.shiftRole, onUpdate]
  );

  const toggleRole = useCallback(
    (roleId: string, enabled: boolean) => {
      const newShiftRoles = [...(formData.shiftRole || [])];
      const roleIndex = newShiftRoles.findIndex(
        (role) => role.role_id.toString() === roleId.toString()
      );

      if (roleIndex === -1) {
        newShiftRoles.push({
          role_id: roleId,
          employee_id: "",
          proximity: "NEARBY",
          break_duration: "0",
          start_day: "NO",
          isDisabled: !enabled,
        });
      } else {
        const existingRole = newShiftRoles[roleIndex];
        if (!existingRole) {
          return;
        }
        newShiftRoles[roleIndex] = {
          ...existingRole,
          isDisabled: !enabled,
        };
      }

      onUpdate("shiftRole", newShiftRoles);
    },
    [formData.shiftRole, onUpdate]
  );

  useEffect(() => {
    if (product?.productPersonnelPricings) {
      product.productPersonnelPricings.forEach((personnel) => {
        const role = personnel?.personnel?.role;
        if (
          role &&
          !formData.shiftRole?.some(
            (r) => r.role_id.toString() === String(role.id)
          )
        ) {
          toggleRole(String(role.id), true);
        }
      });
    }
  }, [product?.productPersonnelPricings, formData.shiftRole, toggleRole]);

  const getEmployeesForRole = useCallback(
    (roleId: string) => {
      return employees.filter(
        (employee) => employee.role.id.toString() === roleId.toString()
      );
    },
    [employees]
  );

  const handleOpenAddEmployeeDialog = useCallback(() => {
    setAddEmployeeDialog(true);
  }, []);

  const handleCloseEmployeeDialog = useCallback(async () => {
    setAddEmployeeDialog(false);
    if (fetchEmployees) {
      await fetchEmployees();
    }
  }, [fetchEmployees]);

  return (
    <div className="space-y-6 mt-8">
      <h3 className="text-xl font-semibold text-[#2D2E33]">{t("title")}</h3>

      {product?.productPersonnelPricings?.map((personnel) => {
        const role = personnel?.personnel?.role;
        if (!role) return null;

        const roleData = formData.shiftRole?.find(
          (r) => r.role_id.toString() === String(role.id)
        );
        const isEnabled = !roleData?.isDisabled;
        const roleIdStr = role?.id?.toString?.() ?? "";
        const roleEmployees = roleIdStr ? getEmployeesForRole(roleIdStr) : [];
        const hasEmployees = roleEmployees.length > 0;

        return (
          <div
            key={role?.id ?? Math.random()}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Label className="text-lg font-semibold text-[#2D2E33] capitalize">
                {role.name}
              </Label>
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) =>
                  toggleRole(String(role.id), checked)
                }
              />
              <p className="text-sm font-medium text-gray-600">
                {isEnabled ? t("enabled") : t("disabled")}
              </p>
            </div>

            {isEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t("selectEmployee")}
                  </Label>
                  <Select
                    value={roleData?.employee_id?.toString() || ""}
                    onValueChange={(value) =>
                      handleRoleChange(String(role.id), "employee_id", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectEmployee")} />
                    </SelectTrigger>
                    <SelectContent>
                      {hasEmployees &&
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
                  {(errors[`shiftRole.${role.id}.employee_id`] ||
                    errors[`shiftRole[${role.id}].employee_id`]) && (
                    <p className="text-sm text-red-500">
                      {errors[`shiftRole.${role.id}.employee_id`] ||
                        errors[`shiftRole[${role.id}].employee_id`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t("selectProximity")}
                  </Label>
                  <Select
                    value={roleData?.proximity || "NEARBY"}
                    onValueChange={(value) =>
                      handleRoleChange(String(role.id), "proximity", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectProximity")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEARBY">{t("nearby")}</SelectItem>
                      <SelectItem value="FAR_AWAY">{t("farAway")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {(errors[`shiftRole.${role.id}.proximity`] ||
                    errors[`shiftRole[${role.id}].proximity`]) && (
                    <p className="text-sm text-red-500">
                      {errors[`shiftRole.${role.id}.proximity`] ||
                        errors[`shiftRole[${role.id}].proximity`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <SMSInput
                    value={roleData?.break_duration || "0"}
                    onChange={(e) =>
                      handleRoleChange(
                        String(role.id),
                        "break_duration",
                        e.target.value
                      )
                    }
                    type="number"
                    placeholder={t("enterBreakDuration")}
                    error={
                      errors[`shiftRole.${role.id}.break_duration`] ||
                      errors[`shiftRole[${role.id}].break_duration`]
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Select
                    value={roleData?.start_day?.toString() || "NO"}
                    onValueChange={(value) =>
                      handleRoleChange(String(role.id), "start_day", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectStartDay")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YES">{t("yes")}</SelectItem>
                      <SelectItem value="NO">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {(errors[`shiftRole.${role.id}.start_day`] ||
                    errors[`shiftRole[${role.id}].start_day`]) && (
                    <p className="text-sm text-red-500">
                      {errors[`shiftRole.${role.id}.start_day`] ||
                        errors[`shiftRole[${role.id}].start_day`]}
                    </p>
                  )}
                </div>
              </div>
            )}
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

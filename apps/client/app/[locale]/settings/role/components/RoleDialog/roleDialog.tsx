"use client";

import { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import MultiSelector from "@workspace/ui/components/custom/MultiSelector";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { Plus, Trash2 } from "lucide-react";
import type { RoleFormData, RoleValidationErrors } from "@/types/role";
import type { Company } from "@/types/configuration";
import { useTranslations } from "next-intl";
import { FORMMODE } from "@/types/shared/global";
import { useCompany } from "@/providers/appProvider";
import {
  expandPermissionsWithDependencies,
  getMultiplePermissionDependencies,
} from "@/constants/permissionDependencies";

interface RolePermissionsDialogProps {
  roles: RoleFormData[];
  setRoles: React.Dispatch<React.SetStateAction<RoleFormData[]>>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Array<{ id?: number; name: string }>;
  errors: Record<number, RoleValidationErrors>;
  companies: Company[];
  onSave: () => void;
  loading: boolean;
  useComponentAs?: FORMMODE;
}

export function RolePermissionsDialog({
  roles,
  setRoles,
  isOpen,
  onOpenChange,
  permissions,
  errors,
  companies,
  onSave,
  loading,
  useComponentAs = "ADD",
}: RolePermissionsDialogProps) {
  const { company } = useCompany();
  const tlabel = useTranslations("common.labels");
  const t = useTranslations("common");
  const tActions = useTranslations("actions");
  const tRoles = useTranslations("pages.roles");

  const handleChange = useCallback(
    (index: number, field: keyof RoleFormData, value: any) => {
      setRoles((prevRoles) => {
        const newRoles = [...prevRoles];
        const updatedRole = { ...newRoles[index] };

        if (field === "act_as_Employee" && value === true) {
          updatedRole.permissions = [];
          if (company?.id) {
            updatedRole.companies = [company.id];
          }
        }

        if (field === "companies") {
          if (updatedRole.act_as_Employee && company?.id) {
            updatedRole.companies = [company.id];
          } else {
            const companyIds = value.map((v: string) => Number(v));
            updatedRole.companies = companyIds;
          }
        } else if (field === "permissions") {
          const selectedPermissionIds = value as number[];
          const validPermissions = permissions.filter(
            (p): p is { id: number; name: string; originalName?: string } =>
              !!p.id
          );
          const expandedPermissions = expandPermissionsWithDependencies(
            selectedPermissionIds,
            validPermissions
          );
          updatedRole.permissions = expandedPermissions;
        } else {
          updatedRole[field] = value;
        }

        newRoles[index] = updatedRole as RoleFormData;
        return newRoles;
      });
    },
    [setRoles, company]
  );

  const addNewRole = useCallback(() => {
    setRoles((prevRoles) => [
      ...prevRoles,
      {
        name: "",
        short_name: "",
        permissions: [],
        act_as_Employee: false,
        companies: company?.id ? [company.id] : [],
        has_train_driver: false,
      },
    ]);
  }, [setRoles, company]);

  useEffect(() => {
    if (isOpen && useComponentAs === "ADD" && roles.length === 0) {
      addNewRole();
    }
  }, [isOpen, useComponentAs, roles.length, addNewRole]);
  const removeRole = useCallback(
    (index: number) => {
      setRoles((prevRoles) => prevRoles.filter((_, i) => i !== index));
    },
    [setRoles]
  );

  const formatPermissionName = useCallback((name: string) => {
    if (!name) return "";

    const parts = name.split(".");

    return parts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }, []);

  const getDependencyPermissions = useCallback(
    (selectedPermissionIds: number[]) => {
      const selectedNames = selectedPermissionIds
        .map((id) => {
          const perm = permissions.find((p) => p.id === id);
          return (perm as any)?.originalName || perm?.name;
        })
        .filter((name): name is string => !!name);

      const dependencyNames = getMultiplePermissionDependencies(selectedNames);
      const dependencyIds = dependencyNames
        .map((name) => {
          const perm = permissions.find(
            (p) => (p as any).originalName === name || p.name === name
          );
          return perm?.id;
        })
        .filter(
          (id): id is number => !!id && !selectedPermissionIds.includes(id)
        );

      return dependencyIds;
    },
    [permissions]
  );

  const handleSelectAllPermissions = (index: number) => {
    setRoles((prevRoles) => {
      const newRoles = [...prevRoles];
      const currentRole = { ...newRoles[index] } as RoleFormData;

      const allPermissionsSelected =
        permissions.length === currentRole.permissions?.length;

      if (allPermissionsSelected) {
        currentRole.permissions = [];
      } else {
        const validPermissions = permissions.filter(
          (p): p is { id: number; name: string; originalName?: string } =>
            !!p.id
        );
        const allPermissionIds = validPermissions.map((p) => p.id);
        const expandedPermissions = expandPermissionsWithDependencies(
          allPermissionIds,
          validPermissions
        );
        currentRole.permissions = expandedPermissions;
      }

      newRoles[index] = currentRole;
      return newRoles;
    });
  };

  useEffect(() => {
    if (company?.id && isOpen) {
      setRoles((prevRoles) =>
        prevRoles.map((role) => {
          // If act_as_Employee is true, ensure only logged-in company is set
          if (role.act_as_Employee) {
            // Only update if companies array doesn't match
            if (
              !role.companies ||
              role.companies.length !== 1 ||
              role.companies[0] !== company.id
            ) {
              return {
                ...role,
                companies: [company.id],
              };
            }
          }
          return role;
        })
      );
    }
  }, [company?.id, isOpen, setRoles]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[785px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-[20px]">
            {useComponentAs === "ADD"
              ? `${tActions("add")} ${tRoles("permissions")}`
              : `${tActions("edit")} ${tlabel("role")}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {roles.map((role, index) => (
            <div key={index} className="space-y-6 border-b pb-6 relative">
              {useComponentAs === "ADD" && roles.length > 1 && (
                <button
                  onClick={() => removeRole(index)}
                  className="absolute right-0 top-0 text-red-500 hover:text-red-700"
                  type="button"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}

              <div className="grid grid-cols-2 gap-6">
                <SMSInput
                  label={tlabel("name")}
                  value={role.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  required
                  error={errors[index]?.name}
                />
                <SMSInput
                  label={tlabel("abbrevation")}
                  value={role.short_name}
                  onChange={(e) =>
                    handleChange(index, "short_name", e.target.value)
                  }
                  required
                  error={errors[index]?.short_name}
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`act-as-employee-${index}`}
                    checked={role.act_as_Employee}
                    onCheckedChange={(checked) =>
                      handleChange(index, "act_as_Employee", checked)
                    }
                  />
                  <Label htmlFor={`act-as-employee-${index}`}>
                    {tRoles("will_Shift_be_assigned_to_this_role")}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`has-train-driver-${index}`}
                    checked={role.has_train_driver}
                    onCheckedChange={(checked) =>
                      handleChange(index, "has_train_driver", checked)
                    }
                  />
                  <Label htmlFor={`has-train-driver-${index}`}>
                    {tRoles("has_train_driver")}
                  </Label>
                </div>

                {!role.act_as_Employee && (
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label>{tRoles("permissions")}</Label>
                      <div className="flex items-center gap-2">
                        <Label className="text-[12px]">{t("select_all")}</Label>
                        <Checkbox
                          checked={
                            permissions.length === role.permissions?.length
                          }
                          onCheckedChange={() =>
                            handleSelectAllPermissions(index)
                          }
                          className="z-10"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <MultiSelector
                        label=""
                        options={permissions?.map((permission) => {
                          const isDependency = getDependencyPermissions(
                            role?.permissions || []
                          ).includes(permission.id || 0);
                          return {
                            label:
                              formatPermissionName(permission.name) +
                              (isDependency ? " (Auto-added)" : ""),
                            value: permission.id?.toString() || "",
                          };
                        })}
                        selected={role?.permissions?.map(String)}
                        onChange={(values) =>
                          handleChange(
                            index,
                            "permissions",
                            values?.map(Number)
                          )
                        }
                        error={errors[index]?.permissions}
                        required
                      />
                      {role?.permissions && role.permissions.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t("note")}:{" "}
                          {tRoles("dependencies_auto_added") ||
                            "Dependencies are automatically added"}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label>{tRoles("assign_to_companies")}</Label>
                  </div>
                  <div className="relative">
                    {role.act_as_Employee ? (
                      <SMSInput
                        label=""
                        value={company?.name || ""}
                        disabled
                        className="bg-gray-50 cursor-not-allowed"
                      />
                    ) : (
                      <MultiSelector
                        label=""
                        options={companies?.map((c) => ({
                          label: c.name,
                          value: c.id?.toString() || "",
                        }))}
                        selected={role?.companies?.map(String) || []}
                        onChange={(values) =>
                          handleChange(
                            index,
                            "companies",
                            values?.map(Number) || []
                          )
                        }
                        error={errors[index]?.companies}
                        required
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {useComponentAs === "ADD" && (
            <div className="flex justify-center mt-6">
              <SMSButton
                type="button"
                variant="outline"
                onClick={addNewRole}
                className="flex items-center gap-2 bg-white border-0 w-80 rounded-lg text-[#3E8258] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>{tActions("add") + " " + tActions("more")} </span>
                </span>
              </SMSButton>
            </div>
          )}
        </div>

        <DialogFooter>
          <SMSButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-10 text-sm"
          >
            {tActions("cancel")}
          </SMSButton>
          <SMSButton
            onClick={onSave}
            loading={loading}
            disabled={loading}
            text={loading ? t("saving") : tActions("save")}
            className="h-10 text-sm"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

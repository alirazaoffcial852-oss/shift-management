"use client";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Plus, Trash2 } from "lucide-react";
import MultiSelector from "@workspace/ui/components/custom/MultiSelector";
import type {
  RoleConfiguration,
  RolePermissionsFormProps,
} from "@/types/configuration";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Switch } from "@workspace/ui/components/switch";
import { expandPermissionsWithDependencies } from "@/constants/permissionDependencies";

export function RolePermissionsForm({
  roles,
  onUpdate,
  errors,
  onContinue,
  permissions,
}: RolePermissionsFormProps) {
  const handleAddMore = () => {
    onUpdate([
      ...roles,
      { name: "", permissions: [], short_name: "", act_as_Employee: false },
    ]);
  };

  const handleRemove = (index: number) => {
    const newRoles = roles.filter((_, i) => i !== index);
    onUpdate(newRoles);
  };

  const handleChange = (
    index: number,
    field: keyof RoleConfiguration,
    value: string | string[] | boolean
  ) => {
    const newRoles = [...roles];
    if (newRoles[index]) {
      if (field === "permissions" && Array.isArray(value)) {
        const selectedPermissionIds = value.map((v) => Number(v));
        const validPermissions = permissions.filter(
          (p): p is { id: number; name: string; originalName?: string } =>
            !!p.id
        );
        const expandedPermissions = expandPermissionsWithDependencies(
          selectedPermissionIds,
          validPermissions
        );
        (newRoles[index][field] as string[]) = expandedPermissions.map(String);
      } else {
      (newRoles[index][field] as typeof value) = value;
      if (field === "act_as_Employee" && value === true) {
        newRoles[index].permissions = [];
        }
      }
    }
    onUpdate(newRoles);
  };

  const handleSelectAllPermissions = (
    index: number,
    checked: boolean | "indeterminate"
  ) => {
    const newRoles = [...roles];
    if (newRoles[index] && permissions) {
      if (checked) {
        const allPermissionIds = permissions
          .filter((p) => p.id)
          .map((p) => p.id as number);
        const validPermissions = permissions.filter(
          (p): p is { id: number; name: string; originalName?: string } =>
            !!p.id
        );
        const expandedPermissions = expandPermissionsWithDependencies(
          allPermissionIds,
          validPermissions
        );
        newRoles[index].permissions = expandedPermissions.map(String);
      } else {
        newRoles[index].permissions = [];
      }
      onUpdate(newRoles);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar">
        {roles &&
          roles.length > 0 &&
          roles.map((role, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border p-6 space-y-5"
            >
              <div className="flex items-start justify-end">
                {roles.length > 1 && (
                  <Trash2
                    className="h-5 w-5 cursor-pointer text-red-500"
                    onClick={() => handleRemove(index)}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={cn(
                    "space-y-6",
                    role.act_as_Employee &&
                      "md:flex md:space-y-0 md:gap-6 md:col-span-2"
                  )}
                >
                  <div className={cn(role.act_as_Employee && "md:w-1/2")}>
                    <SMSInput
                      label="Role Name"
                      value={role.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      required
                      error={errors[`roles.${index}.name`]}
                    />
                  </div>
                  <div className={cn(role.act_as_Employee && "md:w-1/2")}>
                    <SMSInput
                      label="Role Abbreviation"
                      value={role.short_name}
                      onChange={(e) =>
                        handleChange(index, "short_name", e.target.value)
                      }
                      required
                      error={errors[`roles.${index}.short_name`]}
                    />
                  </div>
                </div>
                {!role.act_as_Employee && permissions && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-[18px] font-medium text-gray-700 mb-2">
                        Permissions
                      </label>
                      <div className="flex items-center gap-2">
                        {" "}
                        <label className="block text-[12px] font-medium text-gray-700 ">
                          Select All
                        </label>{" "}
                        <Checkbox
                          checked={
                            role.permissions.length === permissions.length
                          }
                          onCheckedChange={(checked) =>
                            handleSelectAllPermissions(index, checked)
                          }
                        />
                      </div>
                    </div>
                    <MultiSelector
                      options={permissions.map((permission) => ({
                        label: permission.name,
                        value: permission.id?.toString() || "",
                      }))}
                      selected={role.permissions}
                      onChange={(values) =>
                        handleChange(index, "permissions", values)
                      }
                      error={errors[`roles.${index}.permissions`]}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${index}`}
                  checked={role.act_as_Employee}
                  onCheckedChange={(checked) =>
                    handleChange(index, "act_as_Employee", checked as boolean)
                  }
                />
                <Label
                  htmlFor={`role-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Will Shift be assigned to this role?
                </Label>
              </div>
            </div>
          ))}
      </div>

      <div className="sticky bottom-0 bg-white pt-6 space-y-6">
        <div className="flex justify-center">
          <SMSButton
            type="button"
            variant="outline"
            onClick={handleAddMore}
            className="flex items-center gap-2 bg-white border-0 w-80 rounded-lg text-[#3E8258] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add More</span>
            </span>{" "}
          </SMSButton>
        </div>
        <div className="text-end">
          <SMSButton
            className="bg-black rounded-full w-full sm:w-auto"
            onClick={onContinue}
          >
            Continue
          </SMSButton>
        </div>
      </div>
    </div>
  );
}

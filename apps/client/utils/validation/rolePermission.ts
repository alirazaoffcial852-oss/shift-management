import type { RoleFormData, RoleValidationErrors } from "@/types/role";

export const validateRole = (role: RoleFormData): RoleValidationErrors => {
  const errors: RoleValidationErrors = {};

  if (!role.name.trim()) {
    errors.name = "Role name is required";
  }

  if (!role.short_name.trim()) {
    errors.short_name = "Role abbreviation is required";
  }

  if (
    !role.act_as_Employee &&
    (!role.permissions || role.permissions.length === 0)
  ) {
    errors.permissions = "Please select at least one permission";
  }

  return errors;
};

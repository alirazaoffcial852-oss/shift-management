import { RoleConfiguration, Company } from "@/types/configuration";

export const validateRolesAndPermissions = (roles: RoleConfiguration[]) => {
  const errors: { [key: string]: string } = {};

  roles.forEach((role, index) => {
    if (!role.name) {
      errors[`roles.${index}.name`] = "Role name is required";
    }
    if (!role.permissions.length && !role.act_as_Employee) {
      errors[`roles.${index}.permissions`] = "At least one permission is required";
    }
    if (!role.short_name) {
      errors[`roles.${index}.short_name`] = "Role abbreviation is required";
    }
  });

  return errors;
};

export const validateCompanies = (companies: Company[]) => {
  const errors: { [key: string]: string } = {};

  companies.forEach((company, index) => {
    if (!company.name) {
      errors[`companies.${index}.name`] = "Company name is required";
    }
    if (!company.configuration.address) {
      errors[`companies.${index}.address`] = "Company address is required";
    }
    if (!company.configuration.phone) {
      errors[`companies.${index}.phone`] = "Phone Number is required";
    }
    if (!company.configuration.email) {
      errors[`companies.${index}.email`] = "email is required";
    }

    if (company.roles.length === 0) {
      errors[`companies.${index}.roles`] = "Role is required";
    }
  });

  return errors;
};

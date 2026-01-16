import type { FormState } from "@/types/configuration";

export const CONFIGURATION_STEPS = [
  {
    title: "Roles & Permissions",
    description: "Configure roles and permissions",
  },
  {
    title: "Company",
    description: "Add company information",
  },
];

export const COMPANY_ROLES = [
  { value: "manufacturer", label: "Manufacturer" },
  { value: "supplier", label: "Supplier" },
  { value: "distributor", label: "Distributor" },
  { value: "retailer", label: "Retailer" },
];

export const roles_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "supervisor", label: "Supervisor" },
  { value: "operator", label: "Operator" },
  { value: "viewer", label: "Viewer" },
];

export const INITIAL_FORM_STATE: FormState = {
  rolesAndPermissions: [
    {
      name: "",
      permissions: [],
      short_name: "",
      act_as_Employee: false,
    },
  ],
  companies: [
    {
      name: "",
      configuration: {
        address: "",
        phone: "",
        email: "",
        has_locomotive: false,
      },
      roles: [],
      logo: undefined,
    },
  ],
  currentStep: 0,
};

import { RolePermissionsFormProps } from "./configuration";
import { Employee } from "./employee";

export interface Role {
  id?: number;
  name: string;
  act_as: string;
  company_role_id?: number;
}
export interface RoleFormData {
  id?: number;
  name: string;
  short_name: string;
  permissions: number[];
  act_as_Employee: boolean;
  act_as?: "STAFF" | "EMPLOYEE";
  companies: number[]; // Associated company IDs
  employees?: Employee[];
  rolePermissions?: { permission_id: number }[];
  companyRoles?: { company_id: number }[];
  has_train_driver?: boolean;
}

export interface RoleValidationErrors {
  name?: string;
  short_name?: string;
  permissions?: string;
  companies?: string;
}

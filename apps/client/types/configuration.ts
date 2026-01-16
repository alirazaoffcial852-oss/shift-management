import { Role } from "@/types/role";
import { Permissions } from "@/types/permissions";

export interface Company {
  id?: number;
  name: string;
  configuration: {
    address: string;
    phone: string;
    email: string;
    has_locomotive: boolean;
    logo?: File;
    has_project_usn?: boolean;
  };
  logo?: File;
  roles: Role[];
}

export interface RoleConfiguration {
  id?: number;
  name: string;
  permissions: string[];
  short_name: string;
  act_as_Employee: boolean;
}

export interface RolePermissionsFormProps {
  roles: RoleConfiguration[];
  onUpdate: (roles: RoleConfiguration[]) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  permissions: Permissions[];
  permission_id?: number;
}
export interface RolePermissions {
  roles: RoleConfiguration[];
  permissions: Permissions[];
  permission_id: number;
}

export interface CompanyFormProps {
  roles: Role[];
  companies: Company[];
  onUpdate: (companies: Company[]) => void;
  errors: { [key: string]: string };
  onSubmit: () => void;
  handleBack: () => void;
}

export interface FormState {
  rolesAndPermissions: RoleConfiguration[];
  companies: Company[];
  currentStep: number;
}

export interface StepRendererProps {
  roles: any;
  currentStep: number;
  formState: FormState;
  errors: any;
  permissions: Permissions[];
  updateRolesAndPermissions: (data: any) => void;
  updateCompanies: (data: any) => void;
  handleContinue: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
}
